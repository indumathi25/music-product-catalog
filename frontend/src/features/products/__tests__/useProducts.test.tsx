import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProducts } from '../hooks/useProducts';
import { productsApi } from '../api';

vi.mock('../api', () => ({
    productsApi: {
        getAll: vi.fn(),
    },
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

describe('useProducts', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        queryClient.clear();
    });

    it('fetches products on mount', async () => {
        const mockData = {
            data: [{
                id: VALID_UUID,
                title: 'Test Product',
                artistName: 'Test Artist',
                coverArtUrl: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }],
            total: 1,
            page: 1,
            limit: 12
        };
        vi.mocked(productsApi.getAll).mockResolvedValue(mockData);

        const { result } = renderHook(() => useProducts(), { wrapper });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(productsApi.getAll).toHaveBeenCalledWith({ page: 1 }, expect.anything());
        expect(result.current.data?.pages[0].data).toEqual(mockData.data);
    });

    it('passes search params to the API', async () => {
        const mockData = {
            data: [] as any[],
            total: 0,
            page: 1,
            limit: 12
        };
        vi.mocked(productsApi.getAll).mockResolvedValue(mockData as any);

        const { result } = renderHook(() => useProducts({ search: 'query' }), { wrapper });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(productsApi.getAll).toHaveBeenCalledWith(
            { search: 'query', page: 1 },
            expect.anything()
        );
    });
});
