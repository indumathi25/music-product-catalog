import { useQueryClient, InfiniteData } from '@tanstack/react-query';
import { PRODUCTS_QUERY_KEY, useProducts } from './useProducts';
import { Product, ApiListResponse } from '../types';

export function useProductSearch({ search, artistName }: { search: string; artistName: string }) {
    const queryClient = useQueryClient();

    // 1. Instant local results: pull ALL cached list pages using prefix match
    const allCachedEntries = queryClient.getQueriesData<InfiniteData<ApiListResponse<Product>>>(
        { queryKey: PRODUCTS_QUERY_KEY }
    );
    const allCachedProducts = allCachedEntries
        .flatMap(([, data]) => data?.pages.flatMap(page => page.data) ?? []);

    const localResults = allCachedProducts.filter(p => {
        const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.artistName.toLowerCase().includes(search.toLowerCase());
        const matchesArtist = !artistName || p.artistName.toLowerCase().includes(artistName.toLowerCase());
        return matchesSearch && matchesArtist;
    });

    // 2. Server search: both parameters are sent to the backend
    const serverQuery = useProducts({ search, artistName });

    // Extract total count from the first page of results
    const totalCount = serverQuery.data?.pages[0]?.total ?? 0;

    return {
        results: serverQuery.data?.pages.flatMap(page => page.data) ?? localResults,
        totalCount,
        isSearching: serverQuery.isFetching,
        localResults,
        serverQuery
    };
}
