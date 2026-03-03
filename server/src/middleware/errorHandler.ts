import type { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
    statusCode?: number;
}

export function errorHandler(
    err: AppError,
    req: Request,
    res: Response,
    _next: NextFunction
) {
    const statusCode = err.statusCode || 500;

    if (process.env.NODE_ENV !== 'production') {
        console.error(`[Error] ${statusCode} – ${req.method} ${req.path} –`, err.message);
    }

    return res.status(statusCode).json({
        status: 'error',
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
}
