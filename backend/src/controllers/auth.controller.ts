import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

export async function login(req: Request, res: Response) {
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            data: null,
            error: "Bad request",
            message: "Email and password are required"
        });
    }

    if (email !== ENV.ADMIN_EMAIL || password !== ENV.ADMIN_PASSWORD) {
        return res.status(401).json({
            success: false,
            data: null,
            error: "Unauthorized",
            message: "Invalid credentials"
        });
    }

    const token = jwt.sign(
        { email, role: 'admin' },
        ENV.JWT_SECRET_KEY,
        { expiresIn: '24h' }
    );

    res.status(200).json({
        success: true,
        data: { token },
        error: null,
        message: "Login successful"
    });
}