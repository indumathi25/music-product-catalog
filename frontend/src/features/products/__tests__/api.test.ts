import { describe, it, expect, vi, beforeEach } from 'vitest';
import { productsApi } from '../api';
import { apiClient } from '@/lib/apiClient';
import { PRODUCT_LIST_LIMIT } from '@/constants';

vi.mock('@/lib/apiClient', () => ({
    apiClient: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

describe('productsApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getAll calls apiClient.get with correct URL and params', async () => {
        const mockResponse = { data: { data: [], total: 0, page: 1, limit: PRODUCT_LIST_LIMIT } };
        vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

        const params = { search: 'test', page: 2 };
        await productsApi.getAll(params);

        expect(apiClient.get).toHaveBeenCalledWith('/api/products', params, undefined);
    });

    it('getById calls apiClient.get with correct URL', async () => {
        const mockResponse = { data: { data: { id: VALID_UUID, title: 'Test Product' } } };
        vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

        await productsApi.getById(VALID_UUID);

        expect(apiClient.get).toHaveBeenCalledWith(`/api/products/${VALID_UUID}`);
    });

    it('create calls apiClient.post with FormData', async () => {
        const mockResponse = { data: { data: { id: VALID_UUID, title: 'New Product' } } };
        vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

        const dto = { title: 'New Product', artistName: 'Artist', image: { url: 'http://loc', width: 0, height: 0, sizeBytes: 0, mimeType: 'image/jpeg' } };

        await productsApi.create(dto);

        expect(apiClient.post).toHaveBeenCalledWith(
            '/api/products',
            dto,
            undefined
        );
    });

    it('update calls apiClient.put with FormData', async () => {
        const mockResponse = { data: { data: { id: VALID_UUID, title: 'Updated Product' } } };
        vi.mocked(apiClient.put).mockResolvedValue(mockResponse);

        const dto = { title: 'Updated Product' };
        await productsApi.update(VALID_UUID, dto);

        expect(apiClient.put).toHaveBeenCalledWith(
            `/api/products/${VALID_UUID}`,
            dto,
            undefined
        );
    });

    it('delete calls apiClient.delete with correct URL', async () => {
        vi.mocked(apiClient.delete).mockResolvedValue(undefined);

        await productsApi.delete(VALID_UUID);

        expect(apiClient.delete).toHaveBeenCalledWith(`/api/products/${VALID_UUID}`, undefined);
    });
});
