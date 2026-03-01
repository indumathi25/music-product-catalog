import { ProductFormState } from '../reducers/productFormReducer';

const MAX_LENGTH = 200;

export function validateForm(
    state: ProductFormState,
    requireFile = true,
): ProductFormState['errors'] {
    const errors: ProductFormState['errors'] = {};

    const validateText = (
        value: string,
        field: keyof ProductFormState['errors'],
        label: string,
    ) => {
        if (!value.trim()) {
            errors[field] = `${label} is required`;
        } else if (value.length > MAX_LENGTH) {
            errors[field] = `${label} must be at most ${MAX_LENGTH} characters`;
        }
    };

    validateText(state.name, 'name', 'Name');
    validateText(state.artistName, 'artistName', 'Artist name');

    if (requireFile && !state.file) {
        errors.file = 'Cover art is required';
    }

    return errors;
}
