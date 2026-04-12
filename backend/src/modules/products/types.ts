import { ImageMetadata } from '../../lib/storage';

export interface Artist {
    id: string;
    name: string;
    images?: Image[];
    created_at: Date;
}

export interface Image {
    id: string;
    artist_id: string | null;
    url: string;
    alt_text: string | null;
    mime_type: string | null;
    size_bytes: number | null;
    width: number | null;
    height: number | null;
    created_at: Date;
}

export interface Product {
    id: string;
    artist_id: string;
    title: string;
    created_at: Date;
    updated_at: Date;
    artist?: Artist;
    images?: Image[];
}

export interface CreateProductDto {
    title: string;
    artistName: string;
    image: ImageMetadata;
}

export interface UpdateProductDto {
    title?: string;
    artistName?: string;
    image?: ImageMetadata;
}

export interface ImageResponse {
    id: string;
    url: string;
    altText: string | null;
    mimeType: string | null;
    sizeBytes: number | null;
    width: number | null;
    height: number | null;
}

export interface ProductResponse {
    id: string;
    title: string;
    artistName: string;
    images: ImageResponse[];
    createdAt: string;
    updatedAt: string;
}

export interface ErrorResponse {
    error: {
        code: string;
        message: string;
    };
}

export type PaginatedResponse<T> = {
    data: T[];
    total: number;
};

export interface GetAllProductsQuery {
    search?: string;
    artistName?: string;
    page?: number;
    limit?: number;
}
