import { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './env';

/**
 * Helmet configuration for standard security headers.
 * Includes a hardened Content Security Policy (CSP).
 */
export const securityMiddleware = helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Essential for serving images
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: [
                "'self'",
                "data:",
                "blob:",
                "*.amazonaws.com",
                "loremflickr.com",
                "*.googleusercontent.com",
                "*.gravatar.com",
                "s.gravatar.com",
                "*.auth0.com",
                "cdn.auth0.com",
            ],
            connectSrc: ["'self'", "*.amazonaws.com", "*.auth0.com"],
            frameAncestors: ["'none'"], // Prevent clickjacking
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
    },
});

/**
 * CORS configuration for cross-origin requests.
 */
export const corsMiddleware = cors({
    origin: env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-KEY'],
    credentials: true,
});

/**
 * Custom explicit security headers.
 */
export const explicitSecurityHeaders = (_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
};
