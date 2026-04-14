import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createTestWrapper } from '../../../test/TestWrapper';
import { useProducts } from '../hooks/useProducts';
import { productsApi } from '../api';
import { Product, ApiListResponse } from '../types';

vi.mock('../api', () => ({
    productsApi: {
        getAll: vi.fn(),
    },
}));

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

describe('useProducts', () => {
    const wrapper = createTestWrapper();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('fetches products on mount', async () => {
        const mockData = {
            data: [{
                id: VALID_UUID,
                title: 'Test Product',
                artistName: 'Test Artist',
                images: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }],
            total: 1
        };
        vi.mocked(productsApi.getAll).mockResolvedValue(mockData);

        const { result } = renderHook(() => useProducts(), { wrapper });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(productsApi.getAll).toHaveBeenCalledWith(
            expect.objectContaining({ page: 1 }),
            expect.anything()
        );
        expect(result.current.data?.pages[0].data).toEqual(mockData.data);
    });

    it('passes search params to the API', async () => {
        const mockData: ApiListResponse<Product> = {
            data: [],
            total: 0
        };
        vi.mocked(productsApi.getAll).mockResolvedValue(mockData);

        const { result } = renderHook(() => useProducts({ search: 'query' }), { wrapper });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(productsApi.getAll).toHaveBeenCalledWith(
            expect.objectContaining({ search: 'query', page: 1 }),
            expect.anything()
        );
    });
});
