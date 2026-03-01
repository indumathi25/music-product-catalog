import { useInfiniteQuery } from '@tanstack/react-query';
import { productsApi } from '../api';
import { ProductFilterParams } from '../types';

export const PRODUCTS_QUERY_KEY = ['products'] as const;

export function useProducts(params: Omit<ProductFilterParams, 'page'> = {}) {
    const limit = params.limit ?? 12;

    return useInfiniteQuery({
        queryKey: [...PRODUCTS_QUERY_KEY, params],
        queryFn: ({ pageParam = 1, signal }) =>
            productsApi.getAll({ ...params, page: pageParam as number }, signal),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const loadedCount = allPages.length * limit;
            return loadedCount < lastPage.total ? allPages.length + 1 : undefined;
        },
        staleTime: 1000 * 30, // Consider data stale after 30 seconds
        placeholderData: (previousData) => previousData,
    });
}
