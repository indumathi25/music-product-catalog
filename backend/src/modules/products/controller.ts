import { Request, Response, NextFunction } from 'express';
import { productService } from './service';
import { CreateProductInput, UpdateProductInput } from './schema';
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
            res.json(result);
        } catch (err) {
            next(err);
        }
    },

    getById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const product = await productService.getById(Number(req.params['id']));
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
                name: body.name,
                artistName: body.artistName,
                coverUrl,
            });
            res.status(201).json({ data: product });
        } catch (err) {
            next(err);
        }
    },

    update: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const body = req.body as UpdateProductInput;
            const coverUrl = req.file ? await storageService.uploadFile(req.file) : undefined;
            const product = await productService.update(Number(req.params['id']), {
                name: body.name,
                artistName: body.artistName,
                coverUrl,
            });
            res.json({ data: product });
        } catch (err) {
            next(err);
        }
    },

    delete: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await productService.delete(Number(req.params['id']));
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    },
};
