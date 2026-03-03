import { Product, ProductResponse } from './types';

export const productMapper = {
    toResponse: (product: Product): ProductResponse => ({
        id: product.id,
        title: product.title,
        artistName: product.artist?.name ?? 'Unknown Artist',
        images: (product.images ?? []).map((img) => ({
            id: img.id,
            url: img.url,
            altText: img.alt_text,
            mimeType: img.mime_type,
            sizeBytes: img.size_bytes,
            width: img.width,
            height: img.height,
        })),
        createdAt: product.created_at.toISOString(),
        updatedAt: product.updated_at.toISOString(),
    }),
};
