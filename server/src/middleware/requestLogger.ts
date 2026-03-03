import type { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * Attaches a unique request ID (X-Request-ID) to every request.
 * Used for distributed tracing and log correlation.
 */
export function requestId(req: Request, res: Response, next: NextFunction) {
    const id = (req.headers['x-request-id'] as string) || uuidv4();
    (req as any).requestId = id;
    res.setHeader('X-Request-ID', id);
    next();
}

/**
 * Structured request logger with timing info.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const id = (req as any).requestId || '-';

    res.on('finish', () => {
        const duration = Date.now() - start;
        const log = {
            requestId: id,
            method: req.method,
            path: req.path,
            status: res.statusCode,
            durationMs: duration,
            ip: req.ip,
            userAgent: req.get('User-Agent')?.slice(0, 80),
            timestamp: new Date().toISOString(),
        };

        // Color-coded console output
        const color = res.statusCode >= 400 ? '\x1b[31m' : res.statusCode >= 300 ? '\x1b[33m' : '\x1b[32m';
        console.log(
            `${color}[${log.method}]\x1b[0m ${log.path} → ${log.status} (${log.durationMs}ms) [${log.requestId.slice(0, 8)}]`
        );

        // In production: send to external logger (Sentry, Datadog, etc.)
    });

    next();
}
