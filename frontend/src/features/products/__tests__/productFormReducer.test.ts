import { describe, it, expect } from 'vitest';
import {
    productFormReducer,
    initialFormState,
    ProductFormAction,
} from '../reducers/productFormReducer';
import { validateForm } from '../utils/validation';

describe('productFormReducer', () => {
    it('should return initial state', () => {
        const state = productFormReducer(initialFormState, {} as ProductFormAction);
        expect(state).toEqual(initialFormState);
    });

    it('SET_FIELD updates name and clears its error', () => {
        const withError = { ...initialFormState, errors: { name: 'Required' } };
        const next = productFormReducer(withError, {
            type: 'SET_FIELD',
            field: 'name',
            value: 'Abbey Road',
        });
        expect(next.name).toBe('Abbey Road');
        expect(next.errors.name).toBeUndefined();
    });

    it('SET_FILE stores file and preview', () => {
        const file = new File(['x'], 'cover.jpg', { type: 'image/jpeg' });
        const next = productFormReducer(initialFormState, {
            type: 'SET_FILE',
            file,
            preview: 'data:image/jpeg;base64,test',
        });
        expect(next.file).toBe(file);
        expect(next.preview).toBe('data:image/jpeg;base64,test');
    });

    it('CLEAR_FILE removes file and preview', () => {
        const file = new File(['x'], 'cover.jpg', { type: 'image/jpeg' });
        const withFile = { ...initialFormState, file, preview: 'preview-url' };
        const next = productFormReducer(withFile, { type: 'CLEAR_FILE' });
        expect(next.file).toBeNull();
        expect(next.preview).toBeNull();
    });

    it('SET_SUBMITTING toggles isSubmitting', () => {
        const next = productFormReducer(initialFormState, { type: 'SET_SUBMITTING', value: true });
        expect(next.isSubmitting).toBe(true);
    });

    it('RESET returns to initial state', () => {
        const dirty = { ...initialFormState, name: 'Test', isSubmitting: true };
        const next = productFormReducer(dirty, { type: 'RESET' });
        expect(next).toEqual(initialFormState);
    });
});

describe('validateForm', () => {
    it('returns errors for empty fields', () => {
        const errors = validateForm(initialFormState, true);
        expect(errors.name).toBeDefined();
        expect(errors.artistName).toBeDefined();
        expect(errors.file).toBeDefined();
    });

    it('passes when all fields are filled', () => {
        const file = new File(['x'], 'cover.jpg', { type: 'image/jpeg' });
        const state = { ...initialFormState, name: 'Abbey Road', artistName: 'The Beatles', file };
        const errors = validateForm(state, true);
        expect(Object.keys(errors)).toHaveLength(0);
    });
});
