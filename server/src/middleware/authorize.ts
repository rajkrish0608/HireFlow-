import type { Request, Response, NextFunction } from 'express';
import type { UserRole } from '../modules/auth/auth.service';

/**
 * RBAC middleware factory.
 * Usage: router.get('/admin-only', authenticate, authorize('ADMIN'), handler)
 */
export function authorize(...allowedRoles: UserRole[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ status: 'error', message: 'Authentication required.' });
        }

        if (!allowedRoles.includes(req.user.role as UserRole)) {
            return res.status(403).json({
                status: 'error',
                message: `Access denied. Required role: ${allowedRoles.join(' or ')}.`,
            });
        }

        next();
    };
}
