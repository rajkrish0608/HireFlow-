import type { Request, Response, NextFunction } from 'express';
import { registerSchema, loginSchema } from './auth.schema';
import { registerUser, loginUser } from './auth.service';
import { db } from '../../config/db';
import { auditLogs } from '../../db/schema';

export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const parsed = registerSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: parsed.error.flatten().fieldErrors,
            });
        }

        const result = await registerUser(parsed.data);

        // Audit log
        await db.insert(auditLogs).values({
            userId: result.user.id,
            action: 'AUTH_REGISTER',
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            metadata: { role: result.user.role },
        });

        return res.status(201).json({
            status: 'success',
            message: 'Account created successfully',
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: parsed.error.flatten().fieldErrors,
            });
        }

        const result = await loginUser(parsed.data);

        // Audit log
        await db.insert(auditLogs).values({
            userId: result.user.id,
            action: 'AUTH_LOGIN',
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
        });

        return res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
}
