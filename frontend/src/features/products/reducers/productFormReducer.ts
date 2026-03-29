import { Product } from '../types';

export interface ProductFormState {
    title: string;
    artistName: string;
    uploadStatus: 'idle' | 'uploading' | 'success' | 'error';
    file: File | null;
    preview: string | null;
    imageMetadata: { url: string; width: number; height: number; sizeBytes: number; mimeType: string } | null;
    errors: Partial<Record<'title' | 'artistName' | 'file', string>>;
    isSubmitting: boolean;
}

export const initialFormState: ProductFormState = {
    title: '',
    artistName: '',
    uploadStatus: 'idle',
    file: null,
    preview: null,
    imageMetadata: null,
    errors: {},
    isSubmitting: false,
};

export type ProductFormAction =
    | { type: 'SET_FIELD'; field: 'title' | 'artistName'; value: string }
    | { type: 'SET_FILE_IN_PROGRESS'; file: File; preview: string }
    | { type: 'SET_FILE_SUCCESS'; metadata: { url: string; width: number; height: number; sizeBytes: number; mimeType: string } }
    | { type: 'SET_FILE_ERROR'; error: string }
    | { type: 'CLEAR_FILE' }
    | { type: 'SET_ERRORS'; errors: ProductFormState['errors'] }
    | { type: 'SET_SUBMITTING'; value: boolean }
    | { type: 'POPULATE'; product: Product }
    | { type: 'RESET' };

export function productFormReducer(
    state: ProductFormState,
    action: ProductFormAction,
): ProductFormState {
    switch (action.type) {
        case 'SET_FIELD':
            return {
                ...state,
                [action.field]: action.value,
                errors: { ...state.errors, [action.field]: undefined },
            };
        case 'SET_FILE_IN_PROGRESS':
            return {
                ...state,
                uploadStatus: 'uploading',
                file: action.file,
                preview: action.preview,
                errors: { ...state.errors, file: undefined }
            };
        case 'SET_FILE_SUCCESS':
            return {
                ...state,
                uploadStatus: 'success',
                imageMetadata: action.metadata,
            };
        case 'SET_FILE_ERROR':
            return {
                ...state,
                uploadStatus: 'error',
                errors: { ...state.errors, file: action.error }
            };
        case 'CLEAR_FILE':
            if (state.preview && state.uploadStatus === 'uploading') {
                URL.revokeObjectURL(state.preview);
            }
            return { ...state, uploadStatus: 'idle', file: null, preview: null, imageMetadata: null };
        case 'SET_ERRORS':
            return { ...state, errors: action.errors };
        case 'SET_SUBMITTING':
            return { ...state, isSubmitting: action.value };
        case 'POPULATE': {
            const existingImage = action.product.images[0];
            const metadata = existingImage ? {
                url: existingImage.url,
                width: existingImage.width || 0,
                height: existingImage.height || 0,
                sizeBytes: existingImage.sizeBytes || 0,
                mimeType: existingImage.mimeType || 'image/webp'
            } : null;
            return {
                ...state,
                title: action.product.title,
                artistName: action.product.artistName,
                uploadStatus: existingImage ? 'success' : 'idle',
                preview: existingImage?.url ?? null,
                imageMetadata: metadata,
            };
        }
        case 'RESET':
            return initialFormState;
        default:
            return state;
    }
}
