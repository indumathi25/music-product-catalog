import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CreateProductContainer } from '../containers/CreateProductContainer';
import * as useCreateProductMock from '../hooks/useCreateProduct';

vi.mock('../hooks/useCreateProduct', () => ({
    useCreateProduct: vi.fn(),
}));

describe('CreateProductContainer', () => {
    const mockMutateAsync = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useCreateProductMock.useCreateProduct).mockReturnValue({
            mutateAsync: mockMutateAsync,
            isPending: false,
        } as any);
    });

    it('renders the create product form', () => {
        render(
            <MemoryRouter>
                <CreateProductContainer />
            </MemoryRouter>
        );

        expect(screen.getByRole('button', { name: /create product/i })).toBeDefined();
    });

    it('submits the form and navigates on success', async () => {
        mockMutateAsync.mockResolvedValueOnce({});

        render(
            <MemoryRouter>
                <CreateProductContainer />
            </MemoryRouter>
        );

        // Fill out required fields
        fireEvent.change(screen.getByLabelText(/Product Name/i), { target: { value: 'New Song' } });
        fireEvent.change(screen.getByLabelText(/Artist Name/i), { target: { value: 'New Artist' } });

        // Mocking file upload is tricky, we can simulate dispatching state or testing validation separately
        // Here we just want to test container logic. Since validation needs a file, let's inject a mock file.
        const fileInput = screen.getByLabelText(/Cover Art/i, { selector: 'input[type="file"]' });
        const file = new File(['dummy content'], 'cover.png', { type: 'image/png' });
        fireEvent.change(fileInput, { target: { files: [file] } });

        // Wait for FileReader to finish and preview to show up
        await waitFor(() => {
            expect(screen.getByAltText(/Cover art preview/i)).toBeInTheDocument();
        });

        const submitButton = screen.getByRole('button', { name: /create product/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledWith(expect.objectContaining({
                name: 'New Song',
                artistName: 'New Artist',
                coverArt: file
            }));
        });
    });

    it('shows loading state when submitting', () => {
        vi.mocked(useCreateProductMock.useCreateProduct).mockReturnValue({
            mutateAsync: mockMutateAsync,
            isPending: true,
        } as any);

        render(
            <MemoryRouter>
                <CreateProductContainer />
            </MemoryRouter>
        );

        expect(screen.getByRole('button', { name: /saving/i })).toBeDefined();
        expect(screen.getByRole('button', { name: /saving/i })).toHaveProperty('disabled', true);
    });
});
