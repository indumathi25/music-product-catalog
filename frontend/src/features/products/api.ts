import { apiClient } from '@/lib/apiClient';
import { API_PATHS } from '../../constants';
import {
    Product,
    CreateProductDto,
    UpdateProductDto,
    ApiListResponse,
    ApiSingleResponse,
    ProductFilterParams,
    ArtistLibrary,
    Artist,
} from './types';

export const productsApi = {
    getAll: async (params?: ProductFilterParams, signal?: AbortSignal): Promise<ApiListResponse<Product>> => {
        return apiClient.get<ApiListResponse<Product>>(API_PATHS.PRODUCTS.BASE, params as Record<string, unknown>, signal);
    },

    getById: async (id: string): Promise<Product> => {
        const response = await apiClient.get<ApiSingleResponse<Product>>(API_PATHS.PRODUCTS.BY_ID(id));
        return response.data;
    },

    getUploadUrl: async (contentType: string, accessToken?: string): Promise<{ uploadUrl: string, finalUrl: string }> => {
        const response = await apiClient.post<ApiSingleResponse<{ uploadUrl: string, finalUrl: string }>>(
            `${API_PATHS.PRODUCTS.BASE}/upload-url`,
            { contentType },
            accessToken
        );
        return response.data;
    },

    create: async (dto: CreateProductDto, accessToken?: string): Promise<Product> => {
        const response = await apiClient.post<ApiSingleResponse<Product>>(
            API_PATHS.PRODUCTS.BASE,
            dto as unknown as Record<string, unknown>,
            accessToken
        );
        return response.data;
    },

    update: async (id: string, dto: UpdateProductDto, accessToken?: string): Promise<Product> => {
        const response = await apiClient.put<ApiSingleResponse<Product>>(
            API_PATHS.PRODUCTS.BY_ID(id),
            dto as unknown as Record<string, unknown>,
            accessToken,
        );
        return response.data;
    },

    delete: async (id: string, accessToken?: string): Promise<void> => {
        await apiClient.delete(API_PATHS.PRODUCTS.BY_ID(id), accessToken);
    },
};

export const artistsApi = {
    getAll: async (signal?: AbortSignal): Promise<Artist[]> => {
        const response = await apiClient.get<ApiSingleResponse<Artist[]>>(
            API_PATHS.ARTISTS.BASE,
            undefined,
            signal
        );
        return response.data;
    },

    searchByName: async (name: string): Promise<ArtistLibrary | null> => {
        const response = await apiClient.get<ApiSingleResponse<ArtistLibrary | null>>(
            `${API_PATHS.ARTISTS.BASE}/search`,
            { name }
        );
        return response.data;
    },
};
