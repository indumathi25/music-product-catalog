export const API_PATHS = {
    PRODUCTS: {
        BASE: '/api/products',
        BY_ID: (id: string) => `/api/products/${id}`,
    },
    ARTISTS: {
        BASE: '/api/artists',
    },
} as const;
