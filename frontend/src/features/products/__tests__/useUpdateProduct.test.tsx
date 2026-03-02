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

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

describe('useUpdateProduct', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        queryClient.clear();
        vi.spyOn(queryClient, 'invalidateQueries');
        vi.spyOn(queryClient, 'setQueryData');
    });

    it('updates a product and invalidates cache', async () => {
        const mockProduct = { id: VALID_UUID, title: 'Updated Product' };
        vi.mocked(productsApi.update).mockResolvedValue(mockProduct as any);

        const { result } = renderHook(() => useUpdateProduct(), { wrapper });

        const dto = { title: 'Updated Product' };

        result.current.mutate({ id: VALID_UUID, dto });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(productsApi.update).toHaveBeenCalledWith(VALID_UUID, dto);
        expect(queryClient.setQueryData).toHaveBeenCalledWith([...PRODUCT_QUERY_KEY, VALID_UUID], mockProduct);
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: PRODUCTS_QUERY_KEY });
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                payload: expect.objectContaining({ type: 'success' }),
            })
        );
    });
});
