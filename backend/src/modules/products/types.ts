export interface Artist {
    id: string;
    name: string;
    created_at: Date;
}

export interface Product {
    id: string;
    artist_id: string;
    title: string;
    cover_art_url: string;
    created_at: Date;
    updated_at: Date;
    artist?: Artist;
}

export interface CreateProductDto {
    title: string;
    artistName: string;
    coverArtUrl: string;
}

export interface UpdateProductDto {
    title?: string;
    artistName?: string;
    coverArtUrl?: string;
}

export interface ProductResponse {
    id: string;
    title: string;
    artistName: string;
    coverArtUrl: string;
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
