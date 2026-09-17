import Product from "../models/Product.js";
import { sampleProducts } from "../data/sampleProducts.js";
import mongoose from "mongoose";

let localProducts = [...sampleProducts];

// Create a new product
export const createProduct = async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const product = await Product.create(req.body);
            return res.json({
                message: 'Product created successfully',
                product,
            });
        }
        const newProduct = {
            _id: "prod_" + Date.now(),
            ...req.body,
            createdAt: new Date().toISOString()
        };
        localProducts.unshift(newProduct);
        res.json({
            message: 'Product created successfully',
            product: newProduct,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Get all products
export const getProducts = async (req, res) => {
    try {
        const {search, category} = req.query;

        if (mongoose.connection.readyState === 1) {
            let filter = {};
            if (search) {
                filter.title = { $regex: search, $options: 'i' };
            }
            if (category) {
                filter.category = category;
            }
            const products = await Product.find(filter).sort({ createdAt: -1 });
            if (products && products.length > 0) {
                return res.json(products);
            }
        }

        // Fallback to sample/local products
        let filtered = [...localProducts];
        if (search) {
            filtered = filtered.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
        }
        if (category) {
            filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
        }
        res.json(filtered);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Update a product
export const updateProduct = async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const updated = await Product.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            return res.json({
                message: 'Product updated successfully',
                updated,
            });
        }
        const idx = localProducts.findIndex(p => p._id === req.params.id);
        if (idx !== -1) {
            localProducts[idx] = { ...localProducts[idx], ...req.body };
            return res.json({ message: 'Product updated successfully', updated: localProducts[idx] });
        }
        res.status(404).json({ message: 'Product not found' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Delete a product
export const deleteProduct = async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            await Product.findByIdAndDelete(req.params.id);
            return res.json({ message: 'Product deleted successfully' });
        }
        localProducts = localProducts.filter(p => p._id !== req.params.id);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
