import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../api';
import { UpdateProductDto } from '../types';
import { PRODUCTS_QUERY_KEY } from './useProducts';
import { PRODUCT_QUERY_KEY } from './useProduct';
import { useDispatch } from 'react-redux';
import { addToast } from '../../../store/slices/uiSlice';

export function useUpdateProduct() {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: ({ id, dto }: { id: number; dto: UpdateProductDto }) =>
            productsApi.update(id, dto),
        onSuccess: (updatedProduct, { id }) => {
            queryClient.setQueryData([...PRODUCT_QUERY_KEY, id], updatedProduct);
            queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
            dispatch(addToast({ message: 'Product updated successfully', type: 'success' }));
        },
        onError: (error: Error) => {
            dispatch(addToast({ message: error.message || 'Failed to update product', type: 'error' }));
        },
    });
}
