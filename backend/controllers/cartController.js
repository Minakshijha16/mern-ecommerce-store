import Cart from "../models/Cart.js";
import { sampleProducts } from "../data/sampleProducts.js";
import mongoose from "mongoose";

const mockCarts = {};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (mongoose.connection.readyState === 1) {
      let cart = await Cart.findOne({ userId });

      if (!cart) {
        cart = new Cart({ userId, items: [{ productId, quantity: 1 }] });
      } else {
        const item = cart.items.find((i) => i.productId.toString() === productId);
        if (item) {
          item.quantity += 1;
        } else {
          cart.items.push({ productId, quantity: 1 });
        }
      }

      await cart.save();
      await cart.populate("items.productId");
      return res.json({
        message: "Item added to cart",
        cart,
      });
    }

    // Demo Fallback
    if (!mockCarts[userId]) {
      mockCarts[userId] = { userId, items: [] };
    }
    const cart = mockCarts[userId];
    const item = cart.items.find(i => (i.productId._id || i.productId) === productId);
    const prod = sampleProducts.find(p => p._id === productId) || { _id: productId, title: "Item", price: 999 };

    if (item) {
      item.quantity += 1;
    } else {
      cart.items.push({ productId: prod, quantity: 1 });
    }

    res.json({
      message: "Item added to cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Remove item from cart
export const removeItem = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (mongoose.connection.readyState === 1) {
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
      await cart.save();
      return res.json({
        message: "Item removed from cart",
        cart,
      });
    }

    // Demo Fallback
    if (mockCarts[userId]) {
      mockCarts[userId].items = mockCarts[userId].items.filter(
        i => (i.productId._id || i.productId) !== productId
      );
    }
    res.json({
      message: "Item removed from cart",
      cart: mockCarts[userId] || { userId, items: [] },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update item quantity in cart
export const updateQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (mongoose.connection.readyState === 1) {
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      const item = cart.items.find((i) => i.productId.toString() === productId);
      if (!item) {
        return res.status(404).json({ message: "Item not found in cart" });
      }

      item.quantity = quantity;
      await cart.save();
      return res.json({
        message: "Item quantity updated",
        cart,
      });
    }

    // Demo Fallback
    if (mockCarts[userId]) {
      const item = mockCarts[userId].items.find(
        i => (i.productId._id || i.productId) === productId
      );
      if (item) item.quantity = quantity;
    }
    res.json({
      message: "Item quantity updated",
      cart: mockCarts[userId] || { userId, items: [] },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get cart by user ID
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    if (mongoose.connection.readyState === 1) {
      const cart = await Cart.findOne({ userId }).populate("items.productId");
      return res.json(cart || { userId, items: [] });
    }

    // Demo Fallback
    res.json(mockCarts[userId] || { userId, items: [] });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
