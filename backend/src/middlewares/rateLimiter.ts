import { rateLimit } from 'express-rate-limit';

/**
 * Global API rate limiter
 * Limits each IP to 1000 requests per 15 minutes
 */
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 1000,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
        error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Too many requests from this IP, please try again after 15 minutes',
        },
    },
});

/**
 * Stricter limiter for write operations (POST, PUT, DELETE)
 * Limits each IP to 20 requests per 15 minutes
 */
export const writeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
        error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Too many write operations from this IP, please try again after 15 minutes',
        },
    },
});
