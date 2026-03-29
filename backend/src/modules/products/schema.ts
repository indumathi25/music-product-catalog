import { z } from 'zod';

export const imageMetadataSchema = z.object({
    url: z.string().url(),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    sizeBytes: z.number().int().positive(),
    mimeType: z.string(),
});

export const createProductSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title must be at most 200 characters'),
    artistName: z
        .string()
        .min(1, 'Artist name is required')
        .max(200, 'Artist name must be at most 200 characters'),
    image: imageMetadataSchema,
});

export const updateProductSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(200, 'Title must be at most 200 characters')
        .optional(),
    artistName: z
        .string()
        .min(1, 'Artist name is required')
        .max(200, 'Artist name must be at most 200 characters')
        .optional(),
    image: imageMetadataSchema.optional(),
});

export const productIdSchema = z.object({
    id: z.string().uuid('Invalid product ID'),
});

export const uploadUrlSchema = z.object({
    contentType: z.string().min(1, 'contentType is required'),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductIdParam = z.infer<typeof productIdSchema>;
