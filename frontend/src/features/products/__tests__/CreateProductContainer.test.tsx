import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TestWrapper } from '../../../test/TestWrapper';
import { CreateProductContainer } from '../containers/CreateProductContainer';
import * as useCreateProductMock from '../hooks/useCreateProduct';
import * as uploadImageMock from '../utils/uploadImage';

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
        getAccessTokenSilently: vi.fn().mockResolvedValue('mock-token'),
        isAuthenticated: true,
        isLoading: false,
        user: { name: 'Test Admin', email: 'admin@test.com' },
    }),
}));

vi.mock('../hooks/useCreateProduct', () => ({
    useCreateProduct: vi.fn(),
}));

vi.mock('../utils/uploadImage', () => ({
    processAndUploadImage: vi.fn(),
}));

describe('CreateProductContainer', () => {
    const mockMutateAsync = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useCreateProductMock.useCreateProduct).mockReturnValue({
            mutateAsync: mockMutateAsync,
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
        } as unknown as ReturnType<typeof useCreateProductMock.useCreateProduct>);
    });

    it('renders the create product form', () => {
        render(
            <TestWrapper>
                <CreateProductContainer />
            </TestWrapper>
        );

        expect(screen.getByRole('button', { name: /create product/i })).toBeDefined();
    });

    it('submits the form and navigates on success', async () => {
        mockMutateAsync.mockResolvedValueOnce({});
        const mockImageMetadata = {
            url: 'http://localhost/cover.webp',
            width: 600,
            height: 600,
            sizeBytes: 1000,
            mimeType: 'image/webp',
        };
        vi.mocked(uploadImageMock.processAndUploadImage).mockResolvedValue(mockImageMetadata);

        render(
            <TestWrapper>
                <CreateProductContainer />
            </TestWrapper>
        );

        // Fill out required fields
        fireEvent.change(screen.getByLabelText(/Product Title/i), { target: { value: 'New Song' } });
        fireEvent.change(screen.getByLabelText(/Artist Name/i), { target: { value: 'New Artist' } });

        // Mocking file upload
        const fileInput = screen.getByLabelText(/Cover Art/i, { selector: 'input[type="file"]' });
        const file = new File(['dummy content'], 'cover.png', { type: 'image/png' });
        fireEvent.change(fileInput, { target: { files: [file] } });

        // Wait for upload to complete and button to be ready
        const submitButton = await screen.findByRole('button', { name: /create product/i });
        await waitFor(() => expect(submitButton).not.toBeDisabled());
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledWith(expect.objectContaining({
                title: 'New Song',
                artistName: 'New Artist',
                image: mockImageMetadata
            }));
        });
    });

    it('shows loading state when submitting', () => {
        vi.mocked(useCreateProductMock.useCreateProduct).mockReturnValue({
            mutateAsync: mockMutateAsync,
            isPending: true,
            mutate: vi.fn(),
            reset: vi.fn(),
            data: undefined,
            error: null,
            isError: false,
            isIdle: false,
            isPaused: false,
            isSuccess: false,
            failureCount: 0,
            failureReason: null,
            status: 'pending',
            submittedAt: Date.now(),
            variables: undefined,
            context: undefined,
        } as unknown as ReturnType<typeof useCreateProductMock.useCreateProduct>);

        render(
            <TestWrapper>
                <CreateProductContainer />
            </TestWrapper>
        );

        expect(screen.getByRole('button', { name: /saving/i })).toBeDefined();
        expect(screen.getByRole('button', { name: /saving/i })).toHaveProperty('disabled', true);
    });
});
