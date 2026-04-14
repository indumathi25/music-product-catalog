import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth0 } from '@auth0/auth0-react';
import { productsApi } from '../api';
import { PRODUCTS_QUERY_KEY } from './useProducts';
import { useDispatch } from 'react-redux';
import { addToast } from '../../../store/slices/uiSlice';
import { UI_CONSTANTS, QUERY_KEYS } from '../../../constants';

export function useUpdateProduct() {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    const { getAccessTokenSilently } = useAuth0();

    return useMutation({
        mutationFn: async ({ id, title, artistName, image }: { id: string; title?: string; artistName?: string; image?: { url: string; width: number; height: number; sizeBytes: number; mimeType: string } }) => {
            const token = await getAccessTokenSilently();
            return productsApi.update(id, { title, artistName, image }, token);
        },
        onSuccess: (updatedProduct, { id }) => {
            queryClient.setQueryData(QUERY_KEYS.PRODUCT(id), updatedProduct);
            queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
            dispatch(addToast({ message: UI_CONSTANTS.TOAST_MESSAGES.PRODUCT_UPDATE_SUCCESS, type: 'success' }));
        },
    });
}
