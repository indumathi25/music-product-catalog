import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../api';
import { CreateProductDto } from '../types';
import { PRODUCTS_QUERY_KEY } from './useProducts';
import { useDispatch } from 'react-redux';
import { addToast } from '../../../store/slices/uiSlice';

export function useCreateProduct() {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: (dto: CreateProductDto) => productsApi.create(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
            dispatch(addToast({ message: 'Product created successfully!', type: 'success' }));
        },
        onError: (error: Error) => {
            dispatch(addToast({ message: error.message || 'Failed to create product', type: 'error' }));
        },
    });
}
