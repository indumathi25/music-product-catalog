export const UI_CONSTANTS = {
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024, // 5 MB
    TOAST_MESSAGES: {
        PRODUCT_CREATE_SUCCESS: 'Product created successfully',
        PRODUCT_UPDATE_SUCCESS: 'Product updated successfully',
        PRODUCT_DELETE_SUCCESS: 'Product deleted successfully',
        PRODUCT_ERROR_GENERIC: 'An error occurred with the product operation',
    },
    MESSAGES: {
        PRODUCT_LIST: {
            EMPTY_FILTERED: 'No results found in loaded products',
            EMPTY_ALL: 'No products yet',
            EMPTY_FILTERED_DESC: 'Keep scrolling to load more products or try adjusting your filters.',
            EMPTY_ALL_DESC: 'Add your first music product to get started.',
            LOADING_MORE: 'Loading more products...',
            END_OF_CATALOG: "✨ You've reached the end of the catalog",
        },
    },
} as const;

export const ALLOWED_IMAGE_TYPES = UI_CONSTANTS.ALLOWED_IMAGE_TYPES;
export const MAX_FILE_SIZE_BYTES = UI_CONSTANTS.MAX_FILE_SIZE_BYTES;
export const ACCEPTED_IMAGE_TYPES_STRING = UI_CONSTANTS.ALLOWED_IMAGE_TYPES.join(',');
export const MAX_FILE_SIZE_MB = UI_CONSTANTS.MAX_FILE_SIZE_BYTES / (1024 * 1024);
export const MESSAGES = UI_CONSTANTS.MESSAGES;
