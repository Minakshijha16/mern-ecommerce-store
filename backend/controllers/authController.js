import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET || "minashop_jwt_secret_token_123";
const mockUsers = [];

// Signup User
export const signupUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (mongoose.connection.readyState === 1) {
            // Check if user already exists
            const userExists = await User.findOne({ email });
            if (userExists) {
                return res.status(400).json({ message: "User already exists" });
            }

            // Hash password
            const hashPassword = await bcrypt.hash(password, 10);

            // Create User
            await User.create({
                name,
                email,
                password: hashPassword
            });

            return res.json({ message: "User registered successfully" });
        }

        // Demo Fallback
        const existing = mockUsers.find(u => u.email === email);
        if (existing) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = { id: "user_" + Date.now(), name, email, password: hashPassword };
        mockUsers.push(newUser);
        res.json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Login User
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (mongoose.connection.readyState === 1) {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "User not found" });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign(
                { id: user._id },
                JWT_SECRET,
                { expiresIn: "7d" }
            );
            return res.json({
                message: "Login successful",
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        }

        // Demo Fallback
        let user = mockUsers.find(u => u.email === email);
        if (!user) {
            // Auto create demo user for convenience in demo mode
            user = { id: "user_demo_" + Date.now(), name: email.split("@")[0], email };
        }
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};