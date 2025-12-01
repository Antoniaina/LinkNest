import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = mongoose.connect(process.env.MONGO_URI!);
        console.log("MOngoDB connected");
    } catch (err) {
        console.error("MongoDb connection error:", err);
        process.exit(1);
    }
};