import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { useDebounce } from '@/hooks/useDebounce';
import { useProducts } from './useProducts';
import { Product, ProductFilterParams } from '../types';

export function useProductList() {
    const searchQuery = useSelector((state: RootState) => state.products.searchQuery);
    const [filters, setFilters] = useState<Omit<ProductFilterParams, 'search' | 'page'>>({
        artistName: '',
        limit: 12,
    });

    const debouncedSearch = useDebounce(searchQuery, 400);
    const { ref, inView } = useInView();

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

    const allProducts = data?.pages.flatMap((page) => page.data) ?? [];

    const filteredProducts = allProducts.filter((product: Product) => {
        return !filters.artistName || product.artistName.toLowerCase().includes(filters.artistName.toLowerCase());
    });

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
