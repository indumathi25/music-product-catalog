import { Request, Response, NextFunction } from 'express';

/**
 * Basic Authentication Middleware
 * Validates X-API-KEY or Authorization header for non-safe methods (POST, PUT, DELETE)
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Skip auth for GET requests
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }

    const apiKey = req.headers['x-api-key'] || req.headers['authorization'];

    // TODO: this would validate against a DB or JWT
    const expectedKey = process.env.API_KEY || 'fuga_secret_key_2026';

    if (!apiKey || apiKey !== expectedKey) {
        return res.status(401).json({
            error: {
                code: 'UNAUTHORIZED',
                message: 'Invalid or missing API Key/Token',
            },
        });
    }

    next();
};
