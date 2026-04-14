import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createTestWrapper } from '../../../test/TestWrapper';
import { useDeleteProduct } from '../hooks/useDeleteProduct';
import { productsApi } from '../api';

const mockDispatch = vi.fn();

vi.mock('../api', () => ({
    productsApi: {
        delete: vi.fn(),
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

describe('useDeleteProduct', () => {
    const wrapper = createTestWrapper();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deletes a product and invalidates cache', async () => {
        vi.mocked(productsApi.delete).mockResolvedValue(undefined);

        const { result } = renderHook(() => useDeleteProduct(), { wrapper });

        result.current.mutate(VALID_UUID);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(productsApi.delete).toHaveBeenCalledWith(VALID_UUID, 'mock-token');
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                payload: expect.objectContaining({ type: 'success' }),
            })
        );
    });
});
