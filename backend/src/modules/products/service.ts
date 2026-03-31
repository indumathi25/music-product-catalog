import { productRepository } from './repository';
import { AppError } from '../../middlewares/errorHandler';
import { HttpStatus, ErrorCodes, PAGINATION_CONSTANTS } from '../../constants';
import { productMapper } from './mapper';
import { ProductResponse, CreateProductDto, UpdateProductDto, GetAllProductsQuery, PaginatedResponse } from './types';

export const productService = {
    getAll: async (query: GetAllProductsQuery): Promise<PaginatedResponse<ProductResponse>> => {
        const { search, artistName, page = 1, limit = PAGINATION_CONSTANTS.DEFAULT_LIMIT } = query;
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

    getById: async (id: string): Promise<ProductResponse> => {
        const product = await productRepository.findById(id);
        if (!product) {
            throw new AppError(HttpStatus.NOT_FOUND, ErrorCodes.PRODUCT_NOT_FOUND, `Product with id '${id}' not found`);
        }
        return productMapper.toResponse(product);
    },

    create: async (data: CreateProductDto): Promise<ProductResponse> => {
        const product = await productRepository.create(data);
        return productMapper.toResponse(product);
    },

    update: async (id: string, data: UpdateProductDto): Promise<ProductResponse> => {
        const existing = await productRepository.findById(id);
        if (!existing) {
            throw new AppError(HttpStatus.NOT_FOUND, ErrorCodes.PRODUCT_NOT_FOUND, `Product with id '${id}' not found`);
        }

        const updated = await productRepository.update(id, data);
        return productMapper.toResponse(updated);
    },

    delete: async (id: string): Promise<void> => {
        const existing = await productRepository.findById(id);
        if (!existing) {
            throw new AppError(HttpStatus.NOT_FOUND, ErrorCodes.PRODUCT_NOT_FOUND, `Product with id '${id}' not found`);
        }

        // 1. Delete DB record first
        await productRepository.delete(id);
    },
};
