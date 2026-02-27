export interface Product {
    id: number;
    name: string;
    artistName: string;
    coverUrl: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProductDto {
    name: string;
    artistName: string;
    coverArt: File;
}

export interface UpdateProductDto {
    name?: string;
    artistName?: string;
    coverArt?: File;
}

export interface ApiListResponse<T> {
    data: T[];
    total: number;
}

export interface ApiSingleResponse<T> {
    data: T;
}

export interface ApiError {
    error: {
        code: string;
        message: string;
    };
}

export interface ProductFilterParams {
    search?: string;
    artistName?: string;
    page?: number;
    limit?: number;
}
