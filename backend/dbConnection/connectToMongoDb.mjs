import mongoose from "mongoose";

export const connectToMongoDb = async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("Connected to MONGODB");
    } catch (error) {
        console.error("Error connecting to MONGODB");
    }
}