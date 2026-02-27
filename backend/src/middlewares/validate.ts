import { Request, Response, NextFunction } from 'express';
import { ZodType, treeifyError } from 'zod';

type ValidationTarget = 'body' | 'params' | 'query';

/**
 * Middleware for validating requests using Zod schemas.
 */
export const validate =
    <T>(schema: ZodType<T>, target: ValidationTarget = 'body') =>
        (req: Request, res: Response, next: NextFunction): void => {
            const result = schema.safeParse(req[target]);

            if (!result.success) {
                res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Invalid request payload',
                        details: treeifyError(result.error),
                    },
                });
                return;
            }

            // Replace original request data with parsed/validated data (handles type coercion)
            req[target] = result.data;
            next();
        };