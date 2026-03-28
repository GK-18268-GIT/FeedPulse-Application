import mongoose from "mongoose";
import { ENV } from "../config/env.js";

export const connectDB = async () => {
    try {
        const uri = ENV.MONGODB_URL;
        if(!uri) {
            throw new Error("MONGODB_URL environment variable is not defined");
        }

        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected Successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);

    } catch (error) {
        throw new Error("Database connection failed",{cause: error});
    }
}