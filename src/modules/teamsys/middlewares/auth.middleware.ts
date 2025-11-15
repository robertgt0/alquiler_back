import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { JWTPayload } from "../types/auth.types";

declare global {
    namespace Express {
        interface Request {
            authuser?: JWTPayload
            token?: string;
        }
    }
} 

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization as string;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                'message': 'Unauthorized'
            });
        }

        const token = authHeader.split(' ')[1];

        const authService = new AuthService();
        const payload = authService.verifyAccessToken(token);

        req.authuser = payload;
        req.token = token;
        next();
    } catch (error) {
        next(error);
    }
}