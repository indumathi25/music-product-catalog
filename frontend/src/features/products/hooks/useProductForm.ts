import { useReducer, useEffect, type SubmitEvent } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { processAndUploadImage } from '../utils/uploadImage';
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
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        if (initialData) {
            dispatch({ type: 'POPULATE', product: initialData });
        }
    }, [initialData]);

    const performUpload = async (file: File, preview: string) => {
        dispatch({ type: 'SET_FILE_IN_PROGRESS', file, preview });

        try {
            const token = await getAccessTokenSilently();
            const imageMetadata = await processAndUploadImage(file, token);
            dispatch({ type: 'SET_FILE_SUCCESS', metadata: imageMetadata });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
            dispatch({ type: 'SET_FILE_ERROR', error: errorMessage });
        }
    };

    const handleFile = (file: File) => {
        if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
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
        
        const preview = URL.createObjectURL(file);
        performUpload(file, preview);
    };

    const handleRetryUpload = () => {
        if (state.file && state.preview) {
            performUpload(state.file, state.preview);
        }
    };

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isUpdate = !!initialData;
        const errors = validateForm(state);
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

    const handleFieldChange = (field: 'title' | 'artistName', value: string) => {
        dispatch({ type: 'SET_FIELD', field, value });
    };

    const handleClearFile = () => {
        dispatch({ type: 'CLEAR_FILE' });
    };

    return {
        state,
        handleFile,
        handleSubmit,
        handleRetryUpload,
        handleFieldChange,
        handleClearFile,
    };
}
