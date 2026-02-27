import { productRepository } from './repository';
import { AppError } from '../../middlewares/errorHandler';
import { storageService } from '../../lib/storage';
import { productMapper } from './mapper';
import { ProductResponse, CreateProductDto, UpdateProductDto, GetAllProductsQuery, PaginatedResponse } from './types';

export const productService = {
    getAll: async (query: GetAllProductsQuery): Promise<PaginatedResponse<ProductResponse>> => {
        const { search, artistName, page = 1, limit = 10 } = query;
        const skip = (page - 1) * limit;
        const take = limit;

        const [products, total] = await Promise.all([
            productRepository.findAll({ search, artistName, skip, take }),
            productRepository.count({ search, artistName }),
        ]);

        return {
            data: products.map(productMapper.toResponse),
            total,
        };
    },

    getById: async (id: number): Promise<ProductResponse> => {
        const product = await productRepository.findById(id);
        if (!product) {
            throw new AppError(404, 'PRODUCT_NOT_FOUND', `Product with id '${id}' not found`);
        }
        return productMapper.toResponse(product);
    },

    create: async (data: CreateProductDto): Promise<ProductResponse> => {
        const product = await productRepository.create(data);
        return productMapper.toResponse(product);
    },

    update: async (id: number, data: UpdateProductDto): Promise<ProductResponse> => {
        const existing = await productRepository.findById(id);
        if (!existing) {
            throw new AppError(404, 'PRODUCT_NOT_FOUND', `Product with id '${id}' not found`);
        }

        const updated = await productRepository.update(id, data);

        // Remove old image only AFTER successful DB update
        if (data.coverUrl && existing.cover_url !== data.coverUrl) {
            try {
                await storageService.deleteFile(existing.cover_url);
            } catch (err) {
                // Log but don't fail the request since DB update was successful
                console.error(`Failed to delete old file ${existing.cover_url}:`, err);
            }
        }

        return productMapper.toResponse(updated);
    },

    delete: async (id: number): Promise<void> => {
        const existing = await productRepository.findById(id);
        if (!existing) {
            throw new AppError(404, 'PRODUCT_NOT_FOUND', `Product with id '${id}' not found`);
        }

        // 1. Delete DB record first
        await productRepository.delete(id);

        // 2. Cleanup storage second
        try {
            await storageService.deleteFile(existing.cover_url);
        } catch (err) {
            console.error(`Failed to cleanup file ${existing.cover_url} after product deletion:`, err);
        }
    },
};
