import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mern-ecommerce';
        if (!process.env.MONGO_URI) {
            console.warn('⚠️  MONGO_URI not specified in environment variables, defaulting to mongodb://localhost:27017/mern-ecommerce');
        }
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error(`❌ MongoDB connection error: ${error.message}`);
    }
};

export default connectDB;