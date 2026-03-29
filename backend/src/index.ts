import express from 'express';
import cors from 'cors';

import { ENV } from './config/env.js';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.routes.js';

const PORT = ENV.PORT || 5000;

const app = express();

app.use(cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRoutes);

const startServer = async() => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start the server:", error);
        process.exit(1);
    }
};

startServer();
