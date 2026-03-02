import { Product, ProductResponse } from './types';

export const productMapper = {
    toResponse: (product: Product): ProductResponse => ({
        id: product.id,
        title: product.title,
        artistName: product.artist?.name ?? 'Unknown Artist',
        coverArtUrl: product.cover_art_url,
        createdAt: product.created_at.toISOString(),
        updatedAt: product.updated_at.toISOString(),
    }),
};
