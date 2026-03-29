import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

const JWT_SECRET_KEY = ENV.JWT_SECRET_KEY;

export interface IauthRequest extends Request{
    user?: {
        sub: string,
        role: string
    }
}

export function authMiddleware(req: IauthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if(!authHeader?.startsWith('Bearer')) {
        return res.status(401).json({
            message: "Authorization header missing"
        });
    }

    const token = authHeader.split(' ')[1];
    if(!token) {
        return res.status(401).json({
            message: "Token is missing"
        });
    }

    try {
        const decoded = jwt.verify(token, ENV.JWT_SECRET_KEY) as {
            sub: string;
            role: string;
        };
        req.user = decoded;
        next();
    } catch(error) {
        const message = error instanceof Error ? error.message : "Invalid or expired token";
        return res.status(401).json({
            success: false,
            data: null,
            error: "Unauthorized",
            message: "Unauthorized access detected:" + message
        });
    }

}
