import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth0 } from '@auth0/auth0-react';
import { productsApi } from '../api';
import { PRODUCTS_QUERY_KEY } from './useProducts';
import { PRODUCT_QUERY_KEY } from './useProduct';
import { useDispatch } from 'react-redux';
import { addToast } from '../../../store/slices/uiSlice';

export function useDeleteProduct() {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    const { getAccessTokenSilently } = useAuth0();

    return useMutation({
        mutationFn: async (id: string) => {
            const token = await getAccessTokenSilently();
            return productsApi.delete(id, token);
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: [...PRODUCT_QUERY_KEY, id] });
            dispatch(addToast({ message: 'Product deleted successfully', type: 'success' }));
        },
    });
}
