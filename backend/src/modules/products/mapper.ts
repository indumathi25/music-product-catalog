import { Product, ProductResponse } from './types';

export const productMapper = {
    toResponse: (product: Product): ProductResponse => ({
        id: product.id,
        name: product.name,
        artistName: product.artist_name,
        coverUrl: product.cover_url,
        createdAt: product.created_at.toISOString(),
        updatedAt: product.updated_at.toISOString(),
    }),
};
