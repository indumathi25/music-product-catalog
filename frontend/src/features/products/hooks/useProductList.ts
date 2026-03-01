import { useState, useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { useDebounce } from '@/hooks/useDebounce';
import { useProducts, PRODUCTS_QUERY_KEY } from './useProducts';
import { productsApi } from '../api';
import { ProductFilterParams, Product } from '../types';

export function useProductList() {
    const searchQuery = useSelector((state: RootState) => state.products.searchQuery);
    const [filters, setFilters] = useState<Omit<ProductFilterParams, 'search' | 'page'>>({
        artistName: '',
        limit: 12,
    });

    const debouncedSearch = useDebounce(searchQuery, 400);
    const { ref, inView } = useInView();
    const queryClient = useQueryClient();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error
    } = useProducts({ search: debouncedSearch });

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Prefetching the next page
    useEffect(() => {
        const lastPage = data?.pages[data.pages.length - 1];
        if (lastPage && lastPage.data.length === (filters.limit ?? 12)) {
            const nextPage = data.pages.length + 1;
            const totalLoaded = data.pages.length * (filters.limit ?? 12);

            if (totalLoaded < lastPage.total) {
                queryClient.prefetchInfiniteQuery({
                    queryKey: [...PRODUCTS_QUERY_KEY, { search: debouncedSearch }],
                    queryFn: ({ pageParam = nextPage, signal }) =>
                        productsApi.getAll({ search: debouncedSearch, page: pageParam as number }, signal),
                    initialPageParam: 1,
                });
            }
        }
    }, [data, debouncedSearch, filters.limit, queryClient]);

    const allProducts = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data?.pages]);

    const filteredProducts = useMemo(() => {
        return allProducts.filter((product: Product) => {
            return !filters.artistName || product.artistName.toLowerCase().includes(filters.artistName.toLowerCase());
        });
    }, [allProducts, filters.artistName]);

    return {
        searchQuery,
        filters,
        setFilters,
        allProducts,
        filteredProducts,
        isLoading,
        isError,
        error,
        ref,
        inView,
        hasNextPage,
        isFetchingNextPage
    };
}
