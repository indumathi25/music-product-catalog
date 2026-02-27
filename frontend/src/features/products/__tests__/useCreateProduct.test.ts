import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreateProduct } from '../hooks/useCreateProduct';
import { productsApi } from '../api';
import { PRODUCTS_QUERY_KEY } from '../hooks/useProducts';

const mockDispatch = vi.fn();

vi.mock('../api', () => ({
    productsApi: {
        create: vi.fn(),
    },
}));

vi.mock('react-redux', () => ({
    useDispatch: () => mockDispatch,
}));

const queryClient = new QueryClient({
    defaultOptions: {
        mutations: { retry: false },
    }
});
const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client= { queryClient } > { children } </QueryClientProvider>
);

describe('useCreateProduct', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        queryClient.clear();
        vi.spyOn(queryClient, 'invalidateQueries');
    });

    it('creates a product and invalidates cache', async () => {
        const mockProduct = { id: 1, name: 'New Product' };
        vi.mocked(productsApi.create).mockResolvedValue(mockProduct as any);

        const { result } = renderHook(() => useCreateProduct(), { wrapper });

        const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
        const dto = { name: 'New Product', artistName: 'Artist', coverArt: mockFile };

        result.current.mutate(dto);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(productsApi.create).toHaveBeenCalledWith(dto);
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: PRODUCTS_QUERY_KEY });
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                payload: expect.objectContaining({ type: 'success' }),
            })
        );
    });

    it('handles errors', async () => {
        const error = new Error('Create failed');
        vi.mocked(productsApi.create).mockRejectedValue(error);

        const { result } = renderHook(() => useCreateProduct(), { wrapper });

        const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
        const dto = { name: 'New Product', artistName: 'Artist', coverArt: mockFile };

        result.current.mutate(dto);

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                payload: expect.objectContaining({ type: 'error', message: 'Create failed' }),
            })
        );
    });
});
