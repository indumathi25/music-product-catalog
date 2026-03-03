import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProduct } from '../hooks/useProduct';
import { productsApi } from '../api';
import { Product } from '../types';

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

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

describe('useProduct', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        queryClient.clear();
    });

    it('fetches a single product when id is provided', async () => {
        const mockProduct: Product = {
            id: VALID_UUID,
            title: 'Test Product',
            artistName: 'Artist',
            images: [
                {
                    id: 'img-1',
                    url: 'http://example.com/art.jpg',
                    altText: 'Alt text',
                    mimeType: 'image/jpeg',
                    sizeBytes: 5000,
                    width: 500,
                    height: 500,
                },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        vi.mocked(productsApi.getById).mockResolvedValue(mockProduct);

        const { result } = renderHook(() => useProduct(VALID_UUID), { wrapper });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(productsApi.getById).toHaveBeenCalledWith(VALID_UUID);
        expect(result.current.data).toEqual(mockProduct);
    });

    it('is disabled when id is undefined', async () => {
        const { result } = renderHook(() => useProduct(undefined), { wrapper });

        expect(result.current.isPending).toBe(true);
        expect(result.current.fetchStatus).toBe('idle');
        expect(productsApi.getById).not.toHaveBeenCalled();
    });
});
