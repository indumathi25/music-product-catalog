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
    image: {
        url: string;
        width: number;
        height: number;
        sizeBytes: number;
        mimeType: string;
    };
}

export interface UpdateProductDto {
    title?: string;
    artistName?: string;
    image?: {
        url: string;
        width: number;
        height: number;
        sizeBytes: number;
        mimeType: string;
    };
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

export interface ArtistImage {
    id: string;
    url: string;
    width: number | null;
    height: number | null;
    mimeType: string | null;
    sizeBytes: number | null;
    createdAt: string;
}

export interface ArtistLibrary {
    id: string;
    name: string;
    images: ArtistImage[];
}

export interface Artist {
    id: string;
    name: string;
}
