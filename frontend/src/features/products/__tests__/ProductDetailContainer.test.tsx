import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { TestWrapper } from '../../../test/TestWrapper';
import { ProductDetailContainer } from '../containers/ProductDetailContainer';
import * as useProductMock from '../hooks/useProduct';
import * as useUpdateProductMock from '../hooks/useUpdateProduct';
import { Product } from '../types';

const mockDispatch = vi.fn();

vi.mock('react-redux', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-redux')>();
    return {
        ...actual,
        useDispatch: () => mockDispatch,
    };
});

vi.mock('@auth0/auth0-react', () => ({
    useAuth0: () => ({
        isAuthenticated: true,
        isLoading: false,
        user: { name: 'Test Admin', email: 'admin@test.com' },
    }),
}));

vi.mock('../hooks/useProduct', () => ({
    useProduct: vi.fn(),
}));

vi.mock('../hooks/useUpdateProduct', () => ({
    useUpdateProduct: vi.fn(),
}));

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

describe('ProductDetailContainer', () => {
    const mockUpdateMutateAsync = vi.fn();

    const mockProduct: Product = {
        id: VALID_UUID,
        title: 'Test Song',
        artistName: 'Test Artist',
        images: [
            {
                id: 'img-1',
                url: 'http://localhost/cover.jpg',
                altText: 'Cover art',
                mimeType: 'image/webp',
                sizeBytes: 1000,
                width: 600,
                height: 600,
            },
        ],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useProductMock.useProduct).mockReturnValue({
            data: mockProduct,
            isLoading: false,
            isError: false,
            isPending: false,
            isSuccess: true,
            isFetching: false,
            error: null,
            status: 'success',
            fetchStatus: 'idle',
            dataUpdatedAt: 0,
            errorUpdatedAt: 0,
            failureCount: 0,
            failureReason: null,
            errorUpdateCount: 0,
            isFetched: true,
            isFetchedAfterMount: true,
            isInitialLoading: false,
            isPaused: false,
            isPlaceholderData: false,
            isRefetchError: false,
            isRefetching: false,
            isStale: false,
            refetch: vi.fn(),
        } as unknown as ReturnType<typeof useProductMock.useProduct>);

        vi.mocked(useUpdateProductMock.useUpdateProduct).mockReturnValue({
            mutateAsync: mockUpdateMutateAsync,
            isPending: false,
            mutate: vi.fn(),
            reset: vi.fn(),
            data: undefined,
            error: null,
            isError: false,
            isIdle: true,
            isPaused: false,
            isSuccess: false,
            failureCount: 0,
            failureReason: null,
            status: 'idle',
            submittedAt: 0,
            variables: undefined,
            context: undefined,
        } as unknown as ReturnType<typeof useUpdateProductMock.useUpdateProduct>);
    });

    const renderComponent = () => {
        return render(
            <TestWrapper initialEntries={[`/product/${VALID_UUID}`]}>
                <Routes>
                    <Route path="/product/:id" element={<ProductDetailContainer />} />
                </Routes>
            </TestWrapper>
        );
    };

    it('renders product details initially', () => {
        renderComponent();
        expect(screen.getByText('Test Song')).toBeDefined();
        expect(screen.getByText('Test Artist')).toBeDefined();
        expect(screen.getByRole('button', { name: /Edit/i })).toBeDefined();
    });

    it('toggles edit mode when Edit is clicked', () => {
        renderComponent();

        fireEvent.click(screen.getByRole('button', { name: /Edit/i }));

        // Form should now be rendered
        expect(screen.getByLabelText(/Product Title/i)).toHaveValue('Test Song');
        expect(screen.getByRole('button', { name: /Save Changes/i })).toBeDefined();
        expect(screen.getByRole('button', { name: /Cancel/i })).toBeDefined();
    });

    it('saves changes and exits edit mode', async () => {
        mockUpdateMutateAsync.mockResolvedValueOnce({});
        renderComponent();

        // Enter edit mode
        fireEvent.click(screen.getByRole('button', { name: /Edit/i }));

        // Change title
        fireEvent.change(screen.getByLabelText(/Product Title/i), { target: { value: 'Updated Song' } });

        // Save
        const saveButton = screen.getByRole('button', { name: /Save Changes/i });
        await waitFor(() => expect(saveButton).not.toBeDisabled());
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockUpdateMutateAsync).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: VALID_UUID,
                    title: 'Updated Song',
                })
            );
        });

        // It should exit edit mode immediately and show the edit button again.
        await waitFor(() => {
            expect(screen.queryByRole('button', { name: /Save Changes/i })).toBeNull();
            expect(screen.getByRole('button', { name: /Edit/i })).toBeDefined();
        });
    });

    it('cancels edit mode', () => {
        renderComponent();

        // Enter edit mode
        fireEvent.click(screen.getByRole('button', { name: /Edit/i }));

        // Cancel
        fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));

        expect(screen.queryByRole('button', { name: /Save Changes/i })).toBeNull();
        expect(screen.getByRole('button', { name: /Edit/i })).toBeDefined();
    });
});
