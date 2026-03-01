import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProduct } from '../hooks/useProduct';
import { productsApi } from '../api';

vi.mock('../api', () => ({
    productsApi: {
        getById: vi.fn(),
    },
}));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false },
    }
});
const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useProduct', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        queryClient.clear();
    });

    it('fetches a single product when id is provided', async () => {
        const mockProduct = { id: 1, name: 'Test Product' };
        vi.mocked(productsApi.getById).mockResolvedValue(mockProduct as any);

        const { result } = renderHook(() => useProduct(1), { wrapper });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(productsApi.getById).toHaveBeenCalledWith(1);
        expect(result.current.data).toEqual(mockProduct);
    });

    it('is disabled when id is undefined', async () => {
        const { result } = renderHook(() => useProduct(undefined), { wrapper });

        expect(result.current.isPending).toBe(true);
        expect(result.current.fetchStatus).toBe('idle');
        expect(productsApi.getById).not.toHaveBeenCalled();
    });
});
