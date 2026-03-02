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
                res.setHeader('Link', `<${firstProduct.coverArtUrl}>; rel=preload; as=image; fetchpriority=high; crossorigin`);
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

            // Preload the main image for the detail view
            res.setHeader('Link', `<${product.coverArtUrl}>; rel=preload; as=image; fetchpriority=high; crossorigin`);

            res.json({ data: product });
        } catch (err) {
            next(err);
        }
    },

    create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.file) {
                throw new AppError(400, 'MISSING_COVER_ART', 'Cover art image is required');
            }
            const body = req.body as CreateProductInput;
            const coverUrl = await storageService.uploadFile(req.file);
            const product = await productService.create({
                title: body.title,
                artistName: body.artistName,
                coverArtUrl: coverUrl,
            });
            res.status(201).json({ data: product });
        } catch (err) {
            next(err);
        }
    },

    update: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params as unknown as ProductIdParam;
            const body = req.body as UpdateProductInput;
            const coverArtUrl = req.file ? await storageService.uploadFile(req.file) : undefined;
            const product = await productService.update(id, {
                title: body.title,
                artistName: body.artistName,
                coverArtUrl,
            });
            res.json({ data: product });
        } catch (err) {
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
