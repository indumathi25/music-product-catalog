export interface Product {
    id: number;
    name: string;
    artist_name: string;
    cover_url: string;
    created_at: Date;
    updated_at: Date;
}

export interface CreateProductDto {
    name: string;
    artistName: string;
    coverUrl: string;
}

export interface UpdateProductDto {
    name?: string;
    artistName?: string;
    coverUrl?: string;
}

export interface ProductResponse {
    id: number;
    name: string;
    artistName: string;
    coverUrl: string;
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
