import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth0 } from '@auth0/auth0-react';
import { productsApi } from '../api';
import { CreateProductDto } from '../types';
import { PRODUCTS_QUERY_KEY } from './useProducts';
import { useDispatch } from 'react-redux';
import { addToast } from '../../../store/slices/uiSlice';
import { UI_CONSTANTS } from '../../../constants';

export function useCreateProduct() {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    const { getAccessTokenSilently } = useAuth0();

    return useMutation({
        mutationFn: async (dto: CreateProductDto) => {
            const token = await getAccessTokenSilently();
            return productsApi.create(dto, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
            dispatch(addToast({ message: UI_CONSTANTS.TOAST_MESSAGES.PRODUCT_CREATE_SUCCESS, type: 'success' }));
        },
        onError: (error: Error) => {
            dispatch(addToast({ message: error.message || 'Failed to create product', type: 'error' }));
        },
    });
}
