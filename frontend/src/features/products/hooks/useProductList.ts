import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { useDebounce } from '@/hooks/useDebounce';
import { PRODUCT_LIST_LIMIT } from '@/constants';
import { useProductSearch } from './useProductSearch';
import { ProductFilterParams } from '../types';

export function useProductList() {
    const searchQuery = useSelector((state: RootState) => state.products.searchQuery);
    const [filters, setFilters] = useState<Omit<ProductFilterParams, 'search' | 'page'>>({
        artistName: '',
        limit: PRODUCT_LIST_LIMIT,
    });

    const debouncedSearch = useDebounce(searchQuery, 400);
    const debouncedArtist = useDebounce(filters.artistName || '', 400);
    const { ref, inView } = useInView();

    const {
        results: allProducts,
        totalCount,
        serverQuery: {
            fetchNextPage,
            hasNextPage,
            isFetchingNextPage,
            isLoading,
            isError,
            error
        }
    } = useProductSearch({ search: debouncedSearch, artistName: debouncedArtist });

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    return {
        searchQuery,
        filters,
        setFilters,
        allProducts,
        totalCount,
        isLoading,
        isError,
        error,
        ref,
        inView,
        hasNextPage,
        isFetchingNextPage
    };
}
