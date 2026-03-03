import { Product } from '../types';

export interface ProductFormState {
    title: string;
    artistName: string;
    file: File | null;
    preview: string | null;
    errors: Partial<Record<'title' | 'artistName' | 'file', string>>;
    isSubmitting: boolean;
}

export const initialFormState: ProductFormState = {
    title: '',
    artistName: '',
    file: null,
    preview: null,
    errors: {},
    isSubmitting: false,
};

export type ProductFormAction =
    | { type: 'SET_FIELD'; field: 'title' | 'artistName'; value: string }
    | { type: 'SET_FILE'; file: File; preview: string }
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
        case 'SET_FILE':
            return { ...state, file: action.file, preview: action.preview, errors: { ...state.errors, file: undefined } };
        case 'CLEAR_FILE':
            return { ...state, file: null, preview: null };
        case 'SET_ERRORS':
            return { ...state, errors: action.errors };
        case 'SET_SUBMITTING':
            return { ...state, isSubmitting: action.value };
        case 'POPULATE':
            return {
                ...state,
                title: action.product.title,
                artistName: action.product.artistName,
                preview: action.product.images[0]?.url ?? null,
            };
        case 'RESET':
            return initialFormState;
        default:
            return state;
    }
}
