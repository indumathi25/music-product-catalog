import { apiClient } from '@/lib/apiClient';
import { API_PATHS } from '../../constants';
import {
    Product,
    CreateProductDto,
    UpdateProductDto,
    ApiListResponse,
    ApiSingleResponse,
    ProductFilterParams,
} from './types';

export const productsApi = {
    getAll: async (params?: ProductFilterParams, signal?: AbortSignal): Promise<ApiListResponse<Product>> => {
        return apiClient.get<ApiListResponse<Product>>(API_PATHS.PRODUCTS.BASE, params as Record<string, unknown>, signal);
    },

    getById: async (id: string): Promise<Product> => {
        const response = await apiClient.get<ApiSingleResponse<Product>>(API_PATHS.PRODUCTS.BY_ID(id));
        return response.data;
    },

    create: async (dto: CreateProductDto): Promise<Product> => {
        const form = new FormData();
        form.append('title', dto.title);
        form.append('artistName', dto.artistName);
        form.append('coverArt', dto.coverArt);
        const response = await apiClient.post<ApiSingleResponse<Product>>(API_PATHS.PRODUCTS.BASE, form);
        return response.data;
    },

    update: async (id: string, dto: UpdateProductDto): Promise<Product> => {
        const form = new FormData();
        if (dto.title) form.append('title', dto.title);
        if (dto.artistName) form.append('artistName', dto.artistName);
        if (dto.coverArt) form.append('coverArt', dto.coverArt);
        const response = await apiClient.put<ApiSingleResponse<Product>>(
            API_PATHS.PRODUCTS.BY_ID(id),
            form,
        );
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(API_PATHS.PRODUCTS.BY_ID(id));
    },
};
