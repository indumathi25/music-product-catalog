import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createTestWrapper } from '../../../test/TestWrapper';
import { useCreateProduct } from '../hooks/useCreateProduct';
import { productsApi } from '../api';
import { PRODUCTS_QUERY_KEY } from '../hooks/useProducts';
import { Product } from '../types';

const mockDispatch = vi.fn();

vi.mock('../api', () => ({
    productsApi: {
        create: vi.fn(),
    },
}));

vi.mock('react-redux', () => ({
    useDispatch: () => mockDispatch,
}));

vi.mock('@auth0/auth0-react', () => ({
    useAuth0: () => ({
        isAuthenticated: true,
        getAccessTokenSilently: vi.fn().mockResolvedValue('mock-token'),
    }),
}));

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

describe('useCreateProduct', () => {
    const wrapper = createTestWrapper();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('creates a product and invalidates cache', async () => {
        const mockProduct: Product = {
            id: VALID_UUID,
            title: 'New Product',
            artistName: 'Artist',
            images: [
                {
                    id: 'img-1',
                    url: 'http://example.com/art.jpg',
                    altText: 'Alt text',
                    mimeType: 'image/jpeg',
                    sizeBytes: 1000,
                    width: 500,
                    height: 500,
                },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        vi.mocked(productsApi.create).mockResolvedValue(mockProduct);

        const { result } = renderHook(() => useCreateProduct(), { wrapper });

        const dto = { title: 'New Product', artistName: 'Artist', image: { url: 'http://example.com/art.jpg', width: 500, height: 500, sizeBytes: 1000, mimeType: 'image/jpeg' } };

        result.current.mutate(dto);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(productsApi.create).toHaveBeenCalledWith(dto, 'mock-token');
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                payload: expect.objectContaining({ type: 'success' }),
            })
        );
    });

    it('handles errors', async () => {
        const error = new Error('Create failed');
        vi.mocked(productsApi.create).mockRejectedValue(error);

        const { result } = renderHook(() => useCreateProduct(), { wrapper });

        const dto = { title: 'New Product', artistName: 'Artist', image: { url: 'http://example.com/art.jpg', width: 500, height: 500, sizeBytes: 1000, mimeType: 'image/jpeg' } };

        result.current.mutate(dto);

        await waitFor(() => expect(result.current.isError).toBe(true));
        
        expect(mockDispatch).not.toHaveBeenCalledWith(
            expect.objectContaining({
                payload: expect.objectContaining({ type: 'error' }),
            })
        );
    });
});
