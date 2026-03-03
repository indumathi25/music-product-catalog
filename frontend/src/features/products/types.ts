export interface Image {
    id: string;
    url: string;
    altText: string | null;
    mimeType: string | null;
    sizeBytes: number | null;
    width: number | null;
    height: number | null;
}

export interface Product {
    id: string;
    title: string;
    artistName: string;
    images: Image[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateProductDto {
    title: string;
    artistName: string;
    coverArt: File;
}

export interface UpdateProductDto {
    title?: string;
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
