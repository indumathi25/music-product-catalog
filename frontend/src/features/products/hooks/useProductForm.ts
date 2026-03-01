import { useReducer, useCallback, useEffect } from 'react';
import {
    productFormReducer,
    initialFormState,
    ProductFormState,
} from '../reducers/productFormReducer';
import { validateForm } from '../utils/validation';
import { Product } from '../types';
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES } from '@/constants';

interface UseProductFormOptions {
    onSubmit: (state: ProductFormState) => Promise<void>;
    initialData?: Product;
}

export function useProductForm({ onSubmit, initialData }: UseProductFormOptions) {
    const [state, dispatch] = useReducer(productFormReducer, initialFormState);

    useEffect(() => {
        if (initialData) {
            dispatch({ type: 'POPULATE', product: initialData });
        }
    }, [initialData]);

    const handleFile = useCallback((file: File) => {
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            dispatch({
                type: 'SET_ERRORS',
                errors: { file: 'Only JPEG, PNG, and WebP images are allowed' },
            });
            return;
        }
        if (file.size > MAX_FILE_SIZE_BYTES) {
            dispatch({ type: 'SET_ERRORS', errors: { file: 'Image must be under 5 MB' } });
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) =>
            dispatch({ type: 'SET_FILE', file, preview: e.target?.result as string });
        reader.readAsDataURL(file);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isUpdate = !!initialData;
        const errors = validateForm(state, !isUpdate);
        if (Object.keys(errors).length > 0) {
            dispatch({ type: 'SET_ERRORS', errors });
            return;
        }
        dispatch({ type: 'SET_SUBMITTING', value: true });
        try {
            await onSubmit(state);
            if (!isUpdate) {
                dispatch({ type: 'RESET' });
            }
        } finally {
            dispatch({ type: 'SET_SUBMITTING', value: false });
        }
    };

    const handleFieldChange = useCallback((field: 'name' | 'artistName', value: string) => {
        dispatch({ type: 'SET_FIELD', field, value });
    }, []);

    const handleClearFile = useCallback(() => {
        dispatch({ type: 'CLEAR_FILE' });
    }, []);

    return {
        state,
        handleFile,
        handleSubmit,
        handleFieldChange,
        handleClearFile,
    };
}
