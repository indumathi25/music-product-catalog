import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProductList } from '../hooks/useProductList';
import * as useProductsMock from '../hooks/useProducts';
import { Product } from '../types';

vi.mock('../hooks/useProducts', () => ({
    useProducts: vi.fn(),
    PRODUCTS_QUERY_KEY: ['products'],
}));

vi.mock('react-redux', () => ({
    useSelector: vi.fn(),
}));
import { useSelector } from 'react-redux';

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useProductList', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useSelector).mockReturnValue('');

        vi.mocked(useProductsMock.useProducts).mockReturnValue({
            data: { pages: [{ data: [], total: 0, page: 1, limit: 12 }], pageParams: [1] },
            fetchNextPage: vi.fn(),
            hasNextPage: false,
            isFetchingNextPage: false,
            isLoading: false,
            isError: false,
            error: null,
            isSuccess: true,
            isPending: false,
            isFetching: false,
            status: 'success',
            fetchStatus: 'idle',
            dataUpdatedAt: 0,
            errorUpdatedAt: 0,
            failureCount: 0,
            failureReason: null,
            errorUpdateCount: 0,
            isFetched: true,
            isFetchedAfterMount: true,
            isInitialLoading: false,
            isPaused: false,
            isPlaceholderData: false,
            isRefetchError: false,
            isRefetching: false,
            isStale: false,
            refetch: vi.fn(),
        } as any);
    });

    it('initializes with default filters', () => {
        const { result } = renderHook(() => useProductList(), { wrapper });

        expect(result.current.filters).toEqual({ artistName: '', limit: 12 });
        expect(result.current.allProducts).toEqual([]);
    });

    it('updates filters correctly', () => {
        const { result } = renderHook(() => useProductList(), { wrapper });

        act(() => {
            result.current.setFilters({ limit: 12, artistName: 'Beatles' });
        });

        expect(result.current.filters.artistName).toBe('Beatles');
    });

    it('filters products client-side by artist name', () => {
        const mockProducts: Product[] = [
            { id: 1, name: 'A', artistName: 'The Beatles', coverUrl: '', createdAt: '', updatedAt: '' },
            { id: 2, name: 'B', artistName: 'Rolling Stones', coverUrl: '', createdAt: '', updatedAt: '' },
        ];

        vi.mocked(useProductsMock.useProducts).mockReturnValue({
            data: { pages: [{ data: mockProducts, total: 2, page: 1, limit: 12 }], pageParams: [1] },
        } as any);

        const { result } = renderHook(() => useProductList(), { wrapper });

        act(() => {
            result.current.setFilters({ limit: 12, artistName: 'Beatles' });
        });

        expect(result.current.allProducts).toHaveLength(2);
        expect(result.current.filteredProducts).toHaveLength(1);
        expect(result.current.filteredProducts[0].artistName).toBe('The Beatles');
    });
});
