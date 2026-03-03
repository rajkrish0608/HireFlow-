import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import type { JwtPayload } from '../modules/auth/auth.service';

declare global {
    namespace Express {
        // Extend the Passport User interface to include our JWT fields
        interface User extends JwtPayload { }
    }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            status: 'error',
            message: 'Authentication required. Provide a valid Bearer token.',
        });
    }

    const token = authHeader.slice(7);

    try {
        const payload = jwt.verify(token, config.jwt.secret) as JwtPayload;
        req.user = payload;
        next();
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ status: 'error', message: 'Token expired. Please log in again.' });
        }
        return res.status(401).json({ status: 'error', message: 'Invalid token.' });
    }
}
