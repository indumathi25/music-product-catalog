import { apiClient } from '@/lib/apiClient';
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
        return apiClient.get<ApiListResponse<Product>>('/api/products', params as Record<string, unknown>, signal);
    },

    getById: async (id: number): Promise<Product> => {
        const response = await apiClient.get<ApiSingleResponse<Product>>(`/api/products/${id}`);
        return response.data;
    },

    create: async (dto: CreateProductDto): Promise<Product> => {
        const form = new FormData();
        form.append('name', dto.name);
        form.append('artistName', dto.artistName);
        form.append('coverArt', dto.coverArt);
        const response = await apiClient.post<ApiSingleResponse<Product>>('/api/products', form);
        return response.data;
    },

    update: async (id: number, dto: UpdateProductDto): Promise<Product> => {
        const form = new FormData();
        if (dto.name) form.append('name', dto.name);
        if (dto.artistName) form.append('artistName', dto.artistName);
        if (dto.coverArt) form.append('coverArt', dto.coverArt);
        const response = await apiClient.put<ApiSingleResponse<Product>>(
            `/api/products/${id}`,
            form,
        );
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/api/products/${id}`);
    },
};
