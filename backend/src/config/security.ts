import { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './env';

export const securityMiddleware = helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
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
            frameAncestors: ["'none'"],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
    },
});

export const corsMiddleware = cors({
    origin: env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-KEY'],
    credentials: true,
});

export const explicitSecurityHeaders = (_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
};
