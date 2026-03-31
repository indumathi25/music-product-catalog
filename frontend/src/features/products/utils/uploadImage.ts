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

    // Get Presigned URL
    const { uploadUrl, finalUrl } = await productsApi.getUploadUrl(compressedFile.type, token);

    // Upload directly to S3
    const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: compressedFile,
        headers: { 'Content-Type': compressedFile.type },
    });

    if (!uploadRes.ok) {
        throw new Error('Failed to upload image to cloud storage');
    }

    // Get dimensions after upload — minimises GPU memory hold time
    const bmp = await createImageBitmap(compressedFile);
    const { width, height } = bmp;
    bmp.close();

    return {
        url: finalUrl,
        width,
        height,
        sizeBytes: compressedFile.size,
        mimeType: compressedFile.type,
    };
}
