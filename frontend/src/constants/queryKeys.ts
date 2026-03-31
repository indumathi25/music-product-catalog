export const QUERY_KEYS = {
    PRODUCTS: ['products'] as const,
    PRODUCTS_LIST: ['products', 'list'] as const,
    PRODUCT: (id: string) => ['product', id] as const,
    ARTISTS: ['artists'] as const,
} as const;
