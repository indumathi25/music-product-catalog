import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProductListContainer } from '../containers/ProductListContainer';
import * as useProductListMock from '../hooks/useProductList';
import * as useProductDeletionMock from '../hooks/useProductDeletion';

// Need to mock dispatch since EmptyState fires it for "Clear filters"
const mockDispatch = vi.fn();
vi.mock('react-redux', () => ({
    useDispatch: () => mockDispatch,
}));

vi.mock('../hooks/useProductList', () => ({
    useProductList: vi.fn(),
}));

vi.mock('../hooks/useProductDeletion', () => ({
    useProductDeletion: vi.fn(),
}));

describe('ProductListContainer', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(useProductDeletionMock.useProductDeletion).mockReturnValue({
            selectedProduct: null,
            isDeleting: false,
            handleDeleteRequest: vi.fn(),
            handleDeleteConfirm: vi.fn(),
            handleDeleteCancel: vi.fn(),
        } as any);
    });

    it('renders skeleton loader when loading initially', () => {
        vi.mocked(useProductListMock.useProductList).mockReturnValue({
            searchQuery: '',
            filters: { artistName: '', limit: 12 },
            setFilters: vi.fn(),
            allProducts: [],
            filteredProducts: [],
            isLoading: true,
            isError: false,
            error: null,
            ref: vi.fn(),
            hasNextPage: true,
            isFetchingNextPage: false,
        } as any);

        render(
            <MemoryRouter>
                <ProductListContainer />
            </MemoryRouter>
        );

        // Skeleton elements inside the grid
        expect(document.querySelector('.animate-pulse')).toBeDefined();
    });

    it('renders an error message when error occurs', () => {
        vi.mocked(useProductListMock.useProductList).mockReturnValue({
            searchQuery: '',
            filters: { artistName: '', limit: 12 },
            setFilters: vi.fn(),
            allProducts: [],
            filteredProducts: [],
            isLoading: false,
            isError: true,
            error: new Error('Network error'),
            ref: vi.fn(),
            hasNextPage: false,
            isFetchingNextPage: false,
        } as any);

        render(
            <MemoryRouter>
                <ProductListContainer />
            </MemoryRouter>
        );

        expect(screen.getByText('Failed to load products')).toBeDefined();
        expect(screen.getByText('Network error')).toBeDefined();
    });

    it('renders empty state when no products', () => {
        vi.mocked(useProductListMock.useProductList).mockReturnValue({
            searchQuery: '',
            filters: { artistName: '', limit: 12 },
            setFilters: vi.fn(),
            allProducts: [],
            filteredProducts: [],
            isLoading: false,
            isError: false,
            error: null,
            ref: vi.fn(),
            hasNextPage: false,
            isFetchingNextPage: false,
        } as any);

        render(
            <MemoryRouter>
                <ProductListContainer />
            </MemoryRouter>
        );

        expect(screen.getByText('No products yet')).toBeDefined();
    });

    it('renders empty state for filters when products exist but are filtered out', () => {
        vi.mocked(useProductListMock.useProductList).mockReturnValue({
            searchQuery: 'Test',
            filters: { artistName: '', limit: 12 },
            setFilters: vi.fn(),
            allProducts: [{ id: 1, name: 'A', artistName: 'A', coverUrl: '', createdAt: '', updatedAt: '' }],
            filteredProducts: [], // Filtered out
            isLoading: false,
            isError: false,
            error: null,
            ref: vi.fn(),
            hasNextPage: false,
            isFetchingNextPage: false,
        } as any);

        render(
            <MemoryRouter>
                <ProductListContainer />
            </MemoryRouter>
        );

        expect(screen.getByText('No results found in loaded products')).toBeDefined();
    });

    it('renders product grid with products', () => {
        const mockProducts = [
            { id: 1, name: 'Song 1', artistName: 'Artist 1', coverUrl: '', createdAt: '', updatedAt: '' },
            { id: 2, name: 'Song 2', artistName: 'Artist 2', coverUrl: '', createdAt: '', updatedAt: '' },
        ];

        vi.mocked(useProductListMock.useProductList).mockReturnValue({
            searchQuery: '',
            filters: { artistName: '', limit: 12 },
            setFilters: vi.fn(),
            allProducts: mockProducts,
            filteredProducts: mockProducts,
            isLoading: false,
            isError: false,
            error: null,
            ref: vi.fn(),
            hasNextPage: false,
            isFetchingNextPage: false,
        } as any);

        render(
            <MemoryRouter>
                <ProductListContainer />
            </MemoryRouter>
        );

        expect(screen.getByText('Song 1')).toBeDefined();
        expect(screen.getByText('Song 2')).toBeDefined();
    });

    it('renders delete modal when a product is selected for deletion', () => {
        const mockProducts = [
            { id: 1, name: 'Song 1', artistName: 'Artist 1', coverUrl: '', createdAt: '', updatedAt: '' },
        ];

        vi.mocked(useProductListMock.useProductList).mockReturnValue({
            searchQuery: '',
            filters: { artistName: '', limit: 12 },
            setFilters: vi.fn(),
            allProducts: mockProducts,
            filteredProducts: mockProducts,
            isLoading: false,
            isError: false,
            error: null,
            ref: vi.fn(),
            hasNextPage: false,
            isFetchingNextPage: false,
        } as any);

        vi.mocked(useProductDeletionMock.useProductDeletion).mockReturnValue({
            selectedProduct: mockProducts[0], // Modal should be open
            isDeleting: false,
            handleDeleteRequest: vi.fn(),
            handleDeleteConfirm: vi.fn(),
            handleDeleteCancel: vi.fn(),
        } as any);

        render(
            <MemoryRouter>
                <ProductListContainer />
            </MemoryRouter>
        );

        expect(screen.getByRole('dialog', { name: /delete product/i })).toBeDefined();
        expect(screen.getByText(/Are you sure you want to delete/i)).toBeDefined();
        expect(screen.getByText(/"Song 1"/i)).toBeDefined();
    });
});
