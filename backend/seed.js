import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const sampleProducts = [
  {
    title: "MacBook Pro 16-inch M3 Max",
    description: "Apple M3 Max chip with 16-core CPU and 40-core GPU, 36GB Unified Memory, 1TB SSD Storage, Liquid Retina XDR display.",
    price: 3499,
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    stock: 15,
  },
  {
    title: "Dell XPS 15 OLED",
    description: "Intel Core i9 13th Gen, 32GB RAM, 1TB NVMe SSD, NVIDIA RTX 4070, 3.5K OLED InfinityEdge Touch Display.",
    price: 2399,
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80",
    stock: 12,
  },
  {
    title: "iPhone 16 Pro Max",
    description: "Grade 5 Titanium design, A18 Pro chip, 48MP Fusion camera system with 5x Telephoto, 256GB storage.",
    price: 1199,
    category: "Mobiles",
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80",
    stock: 25,
  },
  {
    title: "Samsung Galaxy S24 Ultra",
    description: "Snapdragon 8 Gen 3 for Galaxy, 200MP camera with Galaxy AI, built-in S Pen, 12GB RAM, 512GB storage.",
    price: 1299,
    category: "Mobiles",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
    stock: 18,
  },
  {
    title: "iPad Pro 13-inch M4",
    description: "Ultra Retina XDR OLED display with tandem OLED technology, Apple M4 chip, Apple Pencil Pro support.",
    price: 1299,
    category: "Tablets",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
    stock: 20,
  },
  {
    title: "Samsung Galaxy Tab S9 Ultra",
    description: "14.6-inch Dynamic AMOLED 2X 120Hz display, IP68 water & dust resistance, S Pen included, 512GB storage.",
    price: 1199,
    category: "Tablets",
    image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80",
    stock: 14,
  },
  {
    title: "ASUS ROG Zephyrus G16",
    description: "Intel Core Ultra 9, RTX 4080, 2.5K 240Hz OLED Nebula display, ultra-slim aluminum chassis.",
    price: 2699,
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80",
    stock: 10,
  },
  {
    title: "Google Pixel 9 Pro",
    description: "Google Tensor G4 with advanced Gemini AI features, Super Actua display, triple pro-tier camera array.",
    price: 999,
    category: "Mobiles",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
    stock: 22,
  },
];

async function seed() {
  const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/mern-ecommerce";
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for seeding...");
    await Product.deleteMany({});
    console.log("Cleared existing products.");
    await Product.insertMany(sampleProducts);
    console.log(`Successfully seeded ${sampleProducts.length} sample products!`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();

