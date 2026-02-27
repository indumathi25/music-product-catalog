import { z } from 'zod';

export const createProductSchema = z.object({
    name: z.string().min(1, 'Name is required').max(200, 'Name must be at most 200 characters'),
    artistName: z
        .string()
        .min(1, 'Artist name is required')
        .max(200, 'Artist name must be at most 200 characters'),
});

export const updateProductSchema = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
        .max(200, 'Name must be at most 200 characters')
        .optional(),
    artistName: z
        .string()
        .min(1, 'Artist name is required')
        .max(200, 'Artist name must be at most 200 characters')
        .optional(),
});

export const productIdSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductIdParam = z.infer<typeof productIdSchema>;
