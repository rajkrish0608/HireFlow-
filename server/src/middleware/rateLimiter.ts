import rateLimit from 'express-rate-limit';

/**
 * General API rate limiter – 100 requests per 15 minutes per IP.
 */
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 'error',
        message: 'Too many requests from this IP. Please try again after 15 minutes.',
    },
});

/**
 * Strict limiter for auth routes – 10 attempts per 15 minutes per IP.
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 'error',
        message: 'Too many login attempts. Please try again after 15 minutes.',
    },
});

/**
 * Payment routes limiter – 20 requests per 15 minutes per IP.
 */
export const paymentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 'error',
        message: 'Too many payment requests. Please try again later.',
    },
});
