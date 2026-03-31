export interface ArtistImageResponse {
    id: string;
    url: string;
    width: number | null;
    height: number | null;
    mimeType: string | null;
    sizeBytes: number | null;
    createdAt: string;
}

export interface ArtistSearchResponse {
    id: string;
    name: string;
    images: ArtistImageResponse[];
}
