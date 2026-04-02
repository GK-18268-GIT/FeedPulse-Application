import express from "express";
import cors from "cors";
import feedbackRouter from "../routes/feedback.routes.js";
import authRouter from "../routes/auth.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/feedback', feedbackRouter);
app.use('/api/auth', authRouter);

export default app;