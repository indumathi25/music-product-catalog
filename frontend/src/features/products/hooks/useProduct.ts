import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api';
import { QUERY_KEYS } from '../../../constants';

export const PRODUCT_QUERY_KEY = ['product'] as const;

export function useProduct(id: string | undefined) {
    return useQuery({
        queryKey: QUERY_KEYS.PRODUCT(id || ''),
        queryFn: () => (id ? productsApi.getById(id) : Promise.reject('No ID provided')),
        enabled: !!id,
    });
}
