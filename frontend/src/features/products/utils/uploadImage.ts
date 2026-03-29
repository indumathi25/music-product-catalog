import imageCompression from 'browser-image-compression';
import { productsApi } from '../api';

export async function processAndUploadImage(file: File, token?: string) {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 600,
        useWebWorker: true,
        fileType: 'image/webp',
    };
    const compressedFile = await imageCompression(file, options);

    const bmp = await createImageBitmap(compressedFile);

    // Get Presigned URL
    const { uploadUrl, finalUrl } = await productsApi.getUploadUrl(compressedFile.type, token);

    // Direct HTTP PUT to AWS S3
    const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: compressedFile,
        headers: {
            'Content-Type': compressedFile.type,
        },
    });

    if (!uploadRes.ok) {
        throw new Error('Failed to upload image directly to cloud storage');
    }

    return {
        url: finalUrl,
        width: bmp.width,
        height: bmp.height,
        sizeBytes: compressedFile.size,
        mimeType: compressedFile.type,
    };
}
