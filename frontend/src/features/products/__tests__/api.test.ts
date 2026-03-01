import { describe, it, expect, vi, beforeEach } from 'vitest';
import { productsApi } from '../api';
import { apiClient } from '@/lib/apiClient';

vi.mock('@/lib/apiClient', () => ({
    apiClient: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

describe('productsApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getAll calls apiClient.get with correct URL and params', async () => {
        const mockResponse = { data: { data: [], total: 0, page: 1, limit: 12 } };
        vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

        const params = { search: 'test', page: 2 };
        await productsApi.getAll(params);

        expect(apiClient.get).toHaveBeenCalledWith('/api/products', params, undefined);
    });

    it('getById calls apiClient.get with correct URL', async () => {
        const mockResponse = { data: { data: { id: 1, name: 'Test Product' } } };
        vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

        await productsApi.getById(1);

        expect(apiClient.get).toHaveBeenCalledWith('/api/products/1');
    });

    it('create calls apiClient.post with FormData', async () => {
        const mockResponse = { data: { data: { id: 1, name: 'New Product' } } };
        vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

        const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
        const dto = { name: 'New Product', artistName: 'Artist', coverArt: mockFile };

        await productsApi.create(dto);

        expect(apiClient.post).toHaveBeenCalledWith(
            '/api/products',
            expect.any(FormData)
        );

        // Can't easily inspect FormData within the mock call in Vitest without custom matchers,
        // but verifying it's FormData is sufficient for determining it hit the right path
    });

    it('update calls apiClient.put with FormData', async () => {
        const mockResponse = { data: { data: { id: 1, name: 'Updated Product' } } };
        vi.mocked(apiClient.put).mockResolvedValue(mockResponse);

        const dto = { name: 'Updated Product' };
        await productsApi.update(1, dto);

        expect(apiClient.put).toHaveBeenCalledWith(
            '/api/products/1',
            expect.any(FormData)
        );
    });

    it('delete calls apiClient.delete with correct URL', async () => {
        vi.mocked(apiClient.delete).mockResolvedValue(undefined);

        await productsApi.delete(1);

        expect(apiClient.delete).toHaveBeenCalledWith('/api/products/1');
    });
});
