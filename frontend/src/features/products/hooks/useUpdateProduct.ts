import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../api';
import { UpdateProductDto } from '../types';
import { PRODUCTS_QUERY_KEY } from './useProducts';
import { useDispatch } from 'react-redux';
import { addToast } from '../../../store/slices/uiSlice';
import { UI_CONSTANTS, QUERY_KEYS } from '../../../constants';

export function useUpdateProduct() {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateProductDto }) =>
            productsApi.update(id, dto),
        onSuccess: (updatedProduct, { id }) => {
            queryClient.setQueryData(QUERY_KEYS.PRODUCT(id), updatedProduct);
            queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
            dispatch(addToast({ message: UI_CONSTANTS.TOAST_MESSAGES.PRODUCT_UPDATE_SUCCESS, type: 'success' }));
        },
        onError: (error: Error) => {
            dispatch(addToast({ message: error.message || 'Failed to update product', type: 'error' }));
        },
    });
}
