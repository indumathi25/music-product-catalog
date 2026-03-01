import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api';

export const PRODUCT_QUERY_KEY = ['product'] as const;

export function useProduct(id: number | undefined) {
    return useQuery({
        queryKey: [...PRODUCT_QUERY_KEY, id],
        queryFn: () => (id ? productsApi.getById(id) : Promise.reject('No ID provided')),
        enabled: !!id,
    });
}
