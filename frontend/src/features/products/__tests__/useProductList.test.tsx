import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { createTestWrapper } from '../../../test/TestWrapper';
import { useProductList } from '../hooks/useProductList';
import * as useProductsMock from '../hooks/useProducts';
import { Product, ApiListResponse } from '../types';
import { UseInfiniteQueryResult, InfiniteData } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { PRODUCT_LIST_LIMIT } from '@/constants';

vi.mock('../hooks/useProducts', () => ({
    useProducts: vi.fn(),
    PRODUCTS_QUERY_KEY: ['products', 'list'],
}));

vi.mock('react-redux', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-redux')>();
    return {
        ...actual,
        useSelector: vi.fn(),
    };
});

describe('useProductList', () => {
    const wrapper = createTestWrapper();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useSelector).mockReturnValue('');

        vi.mocked(useProductsMock.useProducts).mockReturnValue({
            data: { pages: [{ data: [], total: 0 }], pageParams: [1] },
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
        } as unknown as UseInfiniteQueryResult<InfiniteData<ApiListResponse<Product>>, Error>);
    });

    it('initializes with default filters', () => {
        const { result } = renderHook(() => useProductList(), { wrapper });

        expect(result.current.filters).toEqual({ artistName: '', limit: PRODUCT_LIST_LIMIT });
        expect(result.current.allProducts).toEqual([]);
    });

    it('updates filters correctly', () => {
        const { result } = renderHook(() => useProductList(), { wrapper });

        act(() => {
            result.current.setFilters({ limit: PRODUCT_LIST_LIMIT, artistName: 'Beatles' });
        });

        expect(result.current.filters.artistName).toBe('Beatles');
    });
});
