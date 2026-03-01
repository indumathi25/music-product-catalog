import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProductDetailContainer } from '../containers/ProductDetailContainer';
import * as useProductMock from '../hooks/useProduct';
import * as useUpdateProductMock from '../hooks/useUpdateProduct';

vi.mock('../hooks/useProduct', () => ({
    useProduct: vi.fn(),
}));

vi.mock('../hooks/useUpdateProduct', () => ({
    useUpdateProduct: vi.fn(),
}));

describe('ProductDetailContainer', () => {
    const mockUpdateMutateAsync = vi.fn();

    const mockProduct = {
        id: 1,
        name: 'Test Song',
        artistName: 'Test Artist',
        coverUrl: 'http://localhost/cover.jpg',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useProductMock.useProduct).mockReturnValue({
            data: mockProduct,
            isLoading: false,
            isError: false,
        } as any);

        vi.mocked(useUpdateProductMock.useUpdateProduct).mockReturnValue({
            mutateAsync: mockUpdateMutateAsync,
            isPending: false,
        } as any);
    });

    const renderComponent = () => {
        return render(
            <MemoryRouter initialEntries={['/product/1']}>
                <Routes>
                    <Route path="/product/:id" element={<ProductDetailContainer />} />
                </Routes>
            </MemoryRouter>
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
        expect(screen.getByLabelText(/Product Name/i)).toHaveValue('Test Song');
        expect(screen.getByRole('button', { name: /Save Changes/i })).toBeDefined();
        expect(screen.getByRole('button', { name: /Cancel/i })).toBeDefined();
    });

    it('saves changes and exits edit mode', async () => {
        mockUpdateMutateAsync.mockResolvedValueOnce({});
        renderComponent();

        // Enter edit mode
        fireEvent.click(screen.getByRole('button', { name: /Edit/i }));

        // Change name
        fireEvent.change(screen.getByLabelText(/Product Name/i), { target: { value: 'Updated Song' } });

        // Save
        fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

        await waitFor(() => {
            expect(mockUpdateMutateAsync).toHaveBeenCalledWith({
                id: 1,
                dto: expect.objectContaining({ name: 'Updated Song' }),
            });
        });

        // Mocking useProduct logic means it won't actually re-render Test Song automatically here
        // unless we update the mock and re-render or the component local state reverts.
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
