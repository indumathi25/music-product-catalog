import { Product, ArtistImage } from '../types';

export interface ProductFormState {
    title: string;
    artistName: string;
    uploadStatus: 'idle' | 'selected' | 'uploading' | 'success' | 'error';
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
    | { type: 'SET_FILE_SELECTED'; file: File; preview: string }
    | { type: 'SET_FILE_IN_PROGRESS' }
    | { type: 'SET_FILE_SUCCESS'; metadata: { url: string; width: number; height: number; sizeBytes: number; mimeType: string } }
    | { type: 'SET_FILE_ERROR'; error: string }
    | { type: 'CLEAR_FILE' }
    | { type: 'SELECT_FROM_LIBRARY'; image: ArtistImage }
    | { type: 'SET_ERRORS'; errors: ProductFormState['errors'] }
    | { type: 'SET_SUBMITTING'; value: boolean }
    | { type: 'POPULATE'; product: Product }
    | { type: 'RESET' };

export function productFormReducer(
    state: ProductFormState,
    action: ProductFormAction,
): ProductFormState {
    switch (action.type) {
        case 'SET_FIELD': {
            const next = { ...state, [action.field]: action.value, errors: { ...state.errors, [action.field]: undefined } };
            // If the artist name changes after picking from library, clear the selection
            // so the user must re-pick or upload — prevents mismatched artist/image
            if (action.field === 'artistName' && state.uploadStatus === 'success' && !state.file) {
                if (state.preview && state.preview.startsWith('blob:')) URL.revokeObjectURL(state.preview);
                return { ...next, uploadStatus: 'idle', preview: null, imageMetadata: null, file: null };
            }
            return next;
        }
        case 'SET_FILE_SELECTED':
            if (state.preview && state.preview.startsWith('blob:')) {
                URL.revokeObjectURL(state.preview);
            }
            return {
                ...state,
                uploadStatus: 'selected',
                file: action.file,
                preview: action.preview,
                imageMetadata: null,
                errors: { ...state.errors, file: undefined },
            };
        case 'SET_FILE_IN_PROGRESS':
            return { ...state, uploadStatus: 'uploading' };
        case 'SET_FILE_SUCCESS':
            return { ...state, uploadStatus: 'success', imageMetadata: action.metadata };
        case 'SET_FILE_ERROR':
            return { ...state, uploadStatus: 'error', errors: { ...state.errors, file: action.error } };
        case 'CLEAR_FILE':
            if (state.preview && state.preview.startsWith('blob:')) {
                URL.revokeObjectURL(state.preview);
            }
            return { ...state, uploadStatus: 'idle', file: null, preview: null, imageMetadata: null };
        case 'SELECT_FROM_LIBRARY': {
            // Revoke any existing blob URL
            if (state.preview && state.preview.startsWith('blob:')) {
                URL.revokeObjectURL(state.preview);
            }
            const img = action.image;
            return {
                ...state,
                uploadStatus: 'success',
                file: null,           // no local file — it's already in S3
                preview: img.url,     // use the S3 URL directly as preview
                imageMetadata: {
                    url: img.url,
                    width: img.width ?? 0,
                    height: img.height ?? 0,
                    sizeBytes: img.sizeBytes ?? 0,
                    mimeType: img.mimeType ?? 'image/webp',
                },
                errors: { ...state.errors, file: undefined },
            };
        }
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
            // Revoke blob URL before resetting to prevent memory leak
            if (state.preview && state.preview.startsWith('blob:')) {
                URL.revokeObjectURL(state.preview);
            }
            return initialFormState;
        default:
            return state;
    }
}
