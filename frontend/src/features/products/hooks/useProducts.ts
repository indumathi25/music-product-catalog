import { useInfiniteQuery } from '@tanstack/react-query';
import { productsApi } from '../api';
import { ProductFilterParams } from '../types';
import { QUERY_KEYS, PRODUCT_LIST_LIMIT } from '../../../constants';

export const PRODUCTS_QUERY_KEY = QUERY_KEYS.PRODUCTS_LIST;

/** Strip falsy values so {search: '', artistName: ''} and {} produce the same cache key */
function normalizeParams(params: Record<string, unknown>): Record<string, unknown> {
    return Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    );
}

export function useProducts(params: Omit<ProductFilterParams, 'page'> = {}) {
    const limit = params.limit ?? PRODUCT_LIST_LIMIT;
    const stableKey = normalizeParams({ ...params, limit });

    return useInfiniteQuery({
        queryKey: [...PRODUCTS_QUERY_KEY, stableKey],
        queryFn: ({ pageParam = 1, signal }) =>
            productsApi.getAll({ ...params, limit, page: pageParam as number }, signal),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const loadedCount = allPages.length * limit;
            return loadedCount < lastPage.total ? allPages.length + 1 : undefined;
        },
        placeholderData: (previousData) => previousData,
    });
}
