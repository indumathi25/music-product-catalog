import { useProductForm, ProductFormValues } from '../hooks/useProductForm';
import { Product } from '../types';
import { useArtistLibrary } from '../hooks/useArtistLibrary';
import { FormInput } from './FormInput';
import { CoverArtUpload } from './CoverArtUpload';
import { ArtistLibraryPicker } from './ArtistLibraryPicker';

interface ProductFormProps {
    onSubmit: (data: ProductFormValues) => Promise<void>;
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
    const { 
        register, 
        handleSubmit, 
        handleFile, 
        handleClearFile, 
        handleSelectFromLibrary, 
        values, 
        errors, 
        isSubmitting, 
        isDirty, 
        preview, 
        uploadStatus, 
        uploadError 
    } = useProductForm({
        onSubmit,
        initialData,
    });

    const { libraryImages } = useArtistLibrary(values.artistName);

    const otherLibraryImages = libraryImages.filter(img => img.url !== preview);

    return (
        <form onSubmit={handleSubmit} noValidate aria-label="Product form" className="space-y-6">
            <FormInput
                id="product-title"
                label="Product Title"
                error={errors.title?.message}
                placeholder="e.g. Abbey Road"
                {...register('title', { required: 'Product title is required' })}
            />

            <FormInput
                id="artist-name"
                label="Artist Name"
                error={errors.artistName?.message}
                placeholder="e.g. The Beatles"
                {...register('artistName', { required: 'Artist name is required' })}
            />

            <CoverArtUpload
                preview={preview}
                fileName={values.file?.name}
                error={uploadError || errors.file?.message}
                status={uploadStatus}
                onFileSelect={handleFile}
                onClear={handleClearFile}
            />

            <ArtistLibraryPicker
                images={otherLibraryImages}
                selectedUrl={preview}
                onSelect={handleSelectFromLibrary}
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting || isLoading}
                        className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:px-8"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting || isLoading || uploadStatus === 'uploading' || !isDirty}
                    aria-disabled={isSubmitting || isLoading || uploadStatus === 'uploading' || !isDirty}
                    className="flex-1 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:px-8"
                >
                    {(isSubmitting || isLoading) ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v8H4Z" />
                            </svg>
                            {uploadStatus === 'uploading' ? 'Uploading…' : 'Saving…'}
                        </span>
                    ) : (
                        submitLabel
                    )}
                </button>
            </div>
        </form>
    );
}
