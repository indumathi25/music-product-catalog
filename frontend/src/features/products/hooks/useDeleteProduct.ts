import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../api';
import { PRODUCTS_QUERY_KEY } from './useProducts';
import { PRODUCT_QUERY_KEY } from './useProduct';
import { useDispatch } from 'react-redux';
import { addToast } from '../../../store/slices/uiSlice';

export function useDeleteProduct() {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: (id: number) => productsApi.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: [...PRODUCT_QUERY_KEY, id] });
            dispatch(addToast({ message: 'Product deleted successfully', type: 'success' }));
        },
        onError: (error: Error) => {
            dispatch(addToast({ message: error.message || 'Failed to delete product', type: 'error' }));
        },
    });
}
