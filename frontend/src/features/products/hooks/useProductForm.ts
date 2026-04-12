import { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth0 } from '@auth0/auth0-react';
import { processAndUploadImage } from '../utils/uploadImage';
import { Product, ArtistImage } from '../types';

export interface ProductFormValues {
    title: string;
    artistName: string;
    file: File | null;
    imageMetadata: {
        url: string;
        width: number;
        height: number;
        sizeBytes: number;
        mimeType: string;
    } | null;
}

interface UseProductFormOptions {
    onSubmit: (data: ProductFormValues) => Promise<void>;
    initialData?: Product;
}

export type UploadStatus = 'idle' | 'selected' | 'uploading' | 'success' | 'error';

export function useProductForm({ onSubmit, initialData }: UseProductFormOptions) {
    const { getAccessTokenSilently } = useAuth0();
    
    const initialImageUrl = useMemo(() => initialData?.images[0]?.url || null, [initialData]);

    const [uploadStatus, setUploadStatus] = useState<UploadStatus>(initialImageUrl ? 'success' : 'idle');
    const [preview, setPreview] = useState<string | null>(initialImageUrl);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const {
        register,
        handleSubmit: rhfHandleSubmit,
        setValue,
        watch,
        reset,
        control, 
        formState: { errors, isSubmitting, isDirty: rhfIsDirty },
    } = useForm<ProductFormValues>({
        defaultValues: {
            title: initialData?.title || '',
            artistName: initialData?.artistName || '',
            file: null,
            imageMetadata: initialData?.images[0] ? {
                url: initialData.images[0].url,
                width: initialData.images[0].width || 0,
                height: initialData.images[0].height || 0,
                sizeBytes: initialData.images[0].sizeBytes || 0,
                mimeType: initialData.images[0].mimeType || 'image/webp'
            } : null,
        },
    });

    const values = watch(); 

    const revokePreview = useCallback(() => {
        if (preview?.startsWith('blob:')) {
            URL.revokeObjectURL(preview);
        }
    }, [preview]);

    useEffect(() => {
        return () => revokePreview();
    }, [revokePreview]);

    const handleFile = useCallback((file: File) => {
        revokePreview(); 
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
        setUploadStatus('selected');
        setUploadError(null);

        setValue('file', file, { shouldDirty: true });
        setValue('imageMetadata', null, { shouldDirty: true });
    }, [setValue, revokePreview]);

    const handleClearFile = useCallback(() => {
        revokePreview();
        setPreview(null);
        setUploadStatus('idle');
        setUploadError(null);
        setValue('file', null, { shouldDirty: true });
        setValue('imageMetadata', null, { shouldDirty: true });
    }, [setValue, revokePreview]);

    const handleSelectFromLibrary = useCallback((image: ArtistImage) => {
        revokePreview();
        setPreview(image.url);
        setUploadStatus('success');
        setUploadError(null);
        setValue('file', null, { shouldDirty: true });
        setValue('imageMetadata', {
            url: image.url,
            width: image.width ?? 0,
            height: image.height ?? 0,
            sizeBytes: image.sizeBytes ?? 0,
            mimeType: image.mimeType ?? 'image/webp',
        }, { shouldDirty: true });
    }, [setValue, revokePreview]);

    const onSubmitHandler = async (data: ProductFormValues) => {
        try {
            let finalData = { ...data };

            if (data.file && !data.imageMetadata) {
                setUploadStatus('uploading');
                const token = await getAccessTokenSilently();
                const metadata = await processAndUploadImage(data.file, token);
                
                setUploadStatus('success');
                setValue('imageMetadata', metadata); 
                finalData.imageMetadata = metadata; 
            }

            await onSubmit(finalData);
            
            if (!initialData) {
                revokePreview();
                reset();
                setPreview(null);
                setUploadStatus('idle');
            }
        } catch (error: unknown) {
            setUploadError(error instanceof Error ? error.message : 'Upload failed');
            setUploadStatus('error');
            console.error('[ProductForm] Submission Error:', error);
            throw error;
        }
    };

    const isDirty = useMemo(() => 
        rhfIsDirty || preview !== initialImageUrl, 
    [rhfIsDirty, preview, initialImageUrl]);

    return {
        register,
        control, 
        handleSubmit: rhfHandleSubmit(onSubmitHandler),
        handleFile,
        handleClearFile,
        handleSelectFromLibrary,
        values,
        errors,
        isSubmitting,
        isDirty,
        preview,
        uploadStatus,
        uploadError,
    };
}
