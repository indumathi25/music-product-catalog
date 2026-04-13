import { Request, Response, NextFunction } from 'express';
import { productService } from './service';
import { CreateProductInput, UpdateProductInput, ProductIdParam } from './schema';
import { AppError } from '../../middlewares/errorHandler';

import { storageService } from '../../lib/storage';

export const productController = {
    getAll: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const query = {
                search: req.query.search as string | undefined,
                artistName: req.query.artistName as string | undefined,
                page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
                limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
            };
            const result = await productService.getAll(query);

            // Add Link header for LCP preload of the first product image
            if (result.data.length > 0) {
                const firstProduct = result.data[0];
                const mainImage = firstProduct.images[0];
                if (mainImage) {
                    res.setHeader('Link', `<${mainImage.url}>; rel=preload; as=image; fetchpriority=high; crossorigin`);
                }
            }

            res.json(result);
        } catch (err) {
            next(err);
        }
    },

    getById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params as unknown as ProductIdParam;
            const product = await productService.getById(id);

            const mainImage = product.images[0];
            if (mainImage) {
                res.setHeader('Link', `<${mainImage.url}>; rel=preload; as=image; fetchpriority=high; crossorigin`);
            }

            res.json({ data: product });
        } catch (err) {
            next(err);
        }
    },

    getUploadUrl: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { contentType } = req.body;
            const urls = await storageService.generatePresignedUrl(contentType);
            res.json({ data: urls });
        } catch (err) {
            next(err);
        }
    },

    create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const body = req.body as CreateProductInput;
            const product = await productService.create({
                title: body.title,
                artistName: body.artistName,
                image: body.image,
            });
            res.status(201).json({ data: product });
        } catch (err) {
            if (err instanceof Error) {
                if (err.message === 'ARTIST_NOT_FOUND') {
                    return next(new AppError(400, 'ARTIST_NOT_FOUND', 'The specified artist does not exist. Please select a valid artist.'));
                }
                if (err.message === 'PRODUCT_ALREADY_EXISTS') {
                    return next(new AppError(409, 'PRODUCT_ALREADY_EXISTS', 'This artist already has a product with this title.'));
                }
            }
            next(err);
        }
    },

    update: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params as unknown as ProductIdParam;
            const body = req.body as UpdateProductInput;
            const product = await productService.update(id, {
                title: body.title,
                artistName: body.artistName,
                image: body.image,
            });
            res.json({ data: product });
        } catch (err) {
            if (err instanceof Error) {
                if (err.message === 'ARTIST_NOT_FOUND') {
                    return next(new AppError(400, 'ARTIST_NOT_FOUND', 'The specified artist does not exist. Please select a valid artist.'));
                }
                if (err.message === 'PRODUCT_ALREADY_EXISTS') {
                    return next(new AppError(409, 'PRODUCT_ALREADY_EXISTS', 'This artist already has a product with this title.'));
                }
            }
            next(err);
        }
    },

    delete: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params as unknown as ProductIdParam;
            await productService.delete(id);
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    },
};
