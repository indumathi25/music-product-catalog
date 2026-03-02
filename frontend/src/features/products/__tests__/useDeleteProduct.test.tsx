import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDeleteProduct } from '../hooks/useDeleteProduct';
import { productsApi } from '../api';
import { PRODUCTS_QUERY_KEY } from '../hooks/useProducts';
import { PRODUCT_QUERY_KEY } from '../hooks/useProduct';

const mockDispatch = vi.fn();

vi.mock('../api', () => ({
    productsApi: {
        delete: vi.fn(),
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
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

describe('useDeleteProduct', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        queryClient.clear();
        vi.spyOn(queryClient, 'invalidateQueries');
    });

    it('deletes a product and invalidates cache', async () => {
        vi.mocked(productsApi.delete).mockResolvedValue(undefined);

        const { result } = renderHook(() => useDeleteProduct(), { wrapper });

        result.current.mutate(VALID_UUID);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(productsApi.delete).toHaveBeenCalledWith(VALID_UUID);
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: PRODUCTS_QUERY_KEY });
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: [...PRODUCT_QUERY_KEY, VALID_UUID] });
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                payload: expect.objectContaining({ type: 'success' }),
            })
        );
    });
});
