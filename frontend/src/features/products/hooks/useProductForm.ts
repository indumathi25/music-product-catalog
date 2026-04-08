import { useReducer, useEffect, type SubmitEvent } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { processAndUploadImage } from '../utils/uploadImage';
import {
    productFormReducer,
    initialFormState,
    ProductFormState,
} from '../reducers/productFormReducer';
import { validateForm } from '../utils/validation';
import { Product, ArtistImage } from '../types';
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
    }, [initialData, dispatch]);

    useEffect(() => {
        return () => {
            if (state.preview && state.preview.startsWith('blob:')) {
                URL.revokeObjectURL(state.preview);
            }
        };
    }, [state.preview]);

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

        // Instantly show the preview — no upload yet
        const preview = URL.createObjectURL(file);
        dispatch({ type: 'SET_FILE_SELECTED', file, preview });
    };

    const handleRetryUpload = () => {
        // Retry is now handled inside handleSubmit — no separate upload step needed
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
            let submittableState = state;

            // Option B: Only upload if we don't already have S3 metadata from a previous attempt
            if (!state.imageMetadata && state.file) {
                dispatch({ type: 'SET_FILE_IN_PROGRESS' });
                const token = await getAccessTokenSilently();
                const imageMetadata = await processAndUploadImage(state.file, token);
                dispatch({ type: 'SET_FILE_SUCCESS', metadata: imageMetadata });
                submittableState = { ...state, imageMetadata };
            }

            await onSubmit(submittableState);
            if (!isUpdate) {
                dispatch({ type: 'RESET' });
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
            dispatch({ type: 'SET_FILE_ERROR', error: errorMessage });
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

    const handleSelectFromLibrary = (image: ArtistImage) => {
        dispatch({ type: 'SELECT_FROM_LIBRARY', image });
    };

    return {
        state,
        handleFile,
        handleSubmit,
        handleRetryUpload,
        handleFieldChange,
        handleClearFile,
        handleSelectFromLibrary,
    };
}
