import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger';
import { env } from '../config/env';

export class AppError extends Error {
    constructor(
        public readonly statusCode: number,
        public readonly code: string,
        message: string,
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export const errorHandler = (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction,
): void => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            error: {
                code: err.code,
                message: err.message,
            },
        });
        return;
    }

    logger.error({ err }, 'Unhandled error');

    res.status(500).json({
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message:
                env.NODE_ENV === 'production'
                    ? 'An unexpected error occurred'
                    : (err instanceof Error ? err.message : String(err)),
        },
    });
};
