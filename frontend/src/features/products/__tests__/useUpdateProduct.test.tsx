import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUpdateProduct } from '../hooks/useUpdateProduct';
import { productsApi } from '../api';
import { PRODUCTS_QUERY_KEY } from '../hooks/useProducts';
import { PRODUCT_QUERY_KEY } from '../hooks/useProduct';

const mockDispatch = vi.fn();

vi.mock('../api', () => ({
    productsApi: {
        update: vi.fn(),
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

describe('useUpdateProduct', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        queryClient.clear();
        vi.spyOn(queryClient, 'invalidateQueries');
        vi.spyOn(queryClient, 'setQueryData');
    });

    it('updates a product and invalidates cache', async () => {
        const mockProduct = { id: 1, name: 'Updated Product' };
        vi.mocked(productsApi.update).mockResolvedValue(mockProduct as any);

        const { result } = renderHook(() => useUpdateProduct(), { wrapper });

        const dto = { name: 'Updated Product' };

        result.current.mutate({ id: 1, dto });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(productsApi.update).toHaveBeenCalledWith(1, dto);
        expect(queryClient.setQueryData).toHaveBeenCalledWith([...PRODUCT_QUERY_KEY, 1], mockProduct);
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: PRODUCTS_QUERY_KEY });
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                payload: expect.objectContaining({ type: 'success' }),
            })
        );
    });
});
