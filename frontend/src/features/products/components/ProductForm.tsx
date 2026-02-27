import { ProductFormState } from '../reducers/productFormReducer';
import { Product } from '../types';
import { useProductForm } from '../hooks/useProductForm';
import { FormInput } from './FormInput';
import { CoverArtUpload } from './CoverArtUpload';

interface ProductFormProps {
    onSubmit: (state: ProductFormState) => Promise<void>;
    isLoading: boolean;
    submitLabel?: string;
    initialData?: Product;
    onCancel?: () => void;
}

export function ProductForm({
    onSubmit,
    isLoading,
    submitLabel = 'Create Product',
    initialData,
    onCancel,
}: ProductFormProps) {
    const { state, handleFile, handleSubmit, handleFieldChange, handleClearFile } = useProductForm({
        onSubmit,
        initialData,
    });

    return (
        <form onSubmit={handleSubmit} noValidate aria-label="Product form" className="space-y-6">
            <FormInput
                id="product-name"
                label="Product Name"
                value={state.name}
                onChange={(val) => handleFieldChange('name', val)}
                error={state.errors.name}
                placeholder="e.g. Abbey Road"
            />

            <FormInput
                id="artist-name"
                label="Artist Name"
                value={state.artistName}
                onChange={(val) => handleFieldChange('artistName', val)}
                error={state.errors.artistName}
                placeholder="e.g. The Beatles"
            />

            <CoverArtUpload
                preview={state.preview}
                fileName={state.file?.name}
                error={state.errors.file}
                onFileSelect={handleFile}
                onClear={handleClearFile}
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={state.isSubmitting || isLoading}
                        className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:px-8"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={state.isSubmitting || isLoading}
                    aria-disabled={state.isSubmitting || isLoading}
                    className="flex-1 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:px-8"
                >
                    {state.isSubmitting || isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v8H4Z" />
                            </svg>
                            Saving…
                        </span>
                    ) : (
                        submitLabel
                    )}
                </button>
            </div>
        </form>
    );
}
