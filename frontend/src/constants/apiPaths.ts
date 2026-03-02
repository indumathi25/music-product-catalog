export const API_PATHS = {
    PRODUCTS: {
        BASE: '/api/products',
        BY_ID: (id: string) => `/api/products/${id}`,
    },
} as const;
