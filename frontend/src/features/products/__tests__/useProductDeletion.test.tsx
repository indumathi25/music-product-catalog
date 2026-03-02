import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProductDeletion } from '../hooks/useProductDeletion';
import * as useDeleteProductMock from '../hooks/useDeleteProduct';

vi.mock('../hooks/useDeleteProduct', () => ({
    useDeleteProduct: vi.fn(),
}));

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

describe('useProductDeletion', () => {
    const mockMutateAsync = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useDeleteProductMock.useDeleteProduct).mockReturnValue({
            mutateAsync: mockMutateAsync,
            isPending: false,
        } as any);
    });

    it('initializes with no selected product', () => {
        const { result } = renderHook(() => useProductDeletion());
        expect(result.current.selectedProduct).toBeNull();
    });

    it('sets selected product on request', () => {
        const { result } = renderHook(() => useProductDeletion());
        const product = { id: VALID_UUID, title: 'Test', artistName: 'Artist' } as any;

        act(() => {
            result.current.handleDeleteRequest(product);
        });

        expect(result.current.selectedProduct).toEqual(product);
    });

    it('calls mutate async and clears selection on confirm', async () => {
        mockMutateAsync.mockResolvedValueOnce(undefined);
        const { result } = renderHook(() => useProductDeletion());
        const product = { id: VALID_UUID, title: 'Test', artistName: 'Artist' } as any;

        act(() => {
            result.current.handleDeleteRequest(product);
        });

        await act(async () => {
            await result.current.handleDeleteConfirm();
        });

        expect(mockMutateAsync).toHaveBeenCalledWith(VALID_UUID);
        expect(result.current.selectedProduct).toBeNull();
    });

    it('clears selection on cancel', () => {
        const { result } = renderHook(() => useProductDeletion());
        const product = { id: VALID_UUID, title: 'Test', artistName: 'Artist' } as any;

        act(() => {
            result.current.handleDeleteRequest(product);
        });

        act(() => {
            result.current.handleDeleteCancel();
        });

        expect(result.current.selectedProduct).toBeNull();
    });
});
