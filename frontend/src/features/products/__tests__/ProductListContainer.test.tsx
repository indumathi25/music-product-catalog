import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TestWrapper } from '../../../test/TestWrapper';
import { ProductListContainer } from '../containers/ProductListContainer';
import * as useProductListMock from '../hooks/useProductList';
import * as useProductDeletionMock from '../hooks/useProductDeletion';
import { MESSAGES, PRODUCT_LIST_LIMIT } from '@/constants';
import { Product } from '../types';

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
        } as unknown as ReturnType<typeof useProductDeletionMock.useProductDeletion>);
    });

    it('renders skeleton loader when loading initially', () => {
        vi.mocked(useProductListMock.useProductList).mockReturnValue({
            searchQuery: '',
            filters: { artistName: '', limit: PRODUCT_LIST_LIMIT },
            setFilters: vi.fn(),
            allProducts: [],
            isLoading: true,
            isError: false,
            error: null,
            ref: vi.fn(),
            hasNextPage: true,
            isFetchingNextPage: false,
            inView: false,
        } as unknown as ReturnType<typeof useProductListMock.useProductList>);

        render(
            <TestWrapper>
                <ProductListContainer />
            </TestWrapper>
        );

        // Skeleton elements inside the grid
        expect(document.querySelector('.animate-pulse')).toBeDefined();
    });

    it('renders an error message when error occurs', () => {
        vi.mocked(useProductListMock.useProductList).mockReturnValue({
            searchQuery: '',
            filters: { artistName: '', limit: PRODUCT_LIST_LIMIT },
            setFilters: vi.fn(),
            allProducts: [],
            isLoading: false,
            isError: true,
            error: new Error('Network error'),
            ref: vi.fn(),
            hasNextPage: false,
            isFetchingNextPage: false,
            inView: false,
        } as unknown as ReturnType<typeof useProductListMock.useProductList>);

        render(
            <TestWrapper>
                <ProductListContainer />
            </TestWrapper>
        );

        expect(screen.getByText('Failed to load products')).toBeDefined();
        expect(screen.getByText('Network error')).toBeDefined();
    });

    it('renders empty state when no products', () => {
        vi.mocked(useProductListMock.useProductList).mockReturnValue({
            searchQuery: '',
            filters: { artistName: '', limit: PRODUCT_LIST_LIMIT },
            setFilters: vi.fn(),
            allProducts: [],
            isLoading: false,
            isError: false,
            error: null,
            ref: vi.fn(),
            hasNextPage: false,
            isFetchingNextPage: false,
            inView: false,
        } as unknown as ReturnType<typeof useProductListMock.useProductList>);

        render(
            <TestWrapper>
                <ProductListContainer />
            </TestWrapper>
        );

        expect(screen.getByText(MESSAGES.PRODUCT_LIST.EMPTY_ALL)).toBeDefined();
    });

    it('renders empty state for filters when products exist but are filtered out', () => {
        vi.mocked(useProductListMock.useProductList).mockReturnValue({
            searchQuery: 'Test',
            filters: { artistName: '', limit: PRODUCT_LIST_LIMIT },
            setFilters: vi.fn(),
            allProducts: [], // Filtered out
            isLoading: false,
            isError: false,
            error: null,
            ref: vi.fn(),
            hasNextPage: false,
            isFetchingNextPage: false,
            inView: false,
        } as unknown as ReturnType<typeof useProductListMock.useProductList>);

        render(
            <TestWrapper>
                <ProductListContainer />
            </TestWrapper>
        );

        expect(screen.getByText(MESSAGES.PRODUCT_LIST.EMPTY_FILTERED)).toBeDefined();
    });

    it('renders product grid with products', () => {
        const mockProducts: Product[] = [
            { id: 'uuid-1', title: 'Song 1', artistName: 'Artist 1', images: [], createdAt: '', updatedAt: '' },
            { id: 'uuid-2', title: 'Song 2', artistName: 'Artist 2', images: [], createdAt: '', updatedAt: '' },
        ];

        vi.mocked(useProductListMock.useProductList).mockReturnValue({
            searchQuery: '',
            filters: { artistName: '', limit: PRODUCT_LIST_LIMIT },
            setFilters: vi.fn(),
            allProducts: mockProducts,
            isLoading: false,
            isError: false,
            error: null,
            ref: vi.fn(),
            hasNextPage: false,
            isFetchingNextPage: false,
            inView: false,
        } as unknown as ReturnType<typeof useProductListMock.useProductList>);

        render(
            <TestWrapper>
                <ProductListContainer />
            </TestWrapper>
        );

        expect(screen.getByText('Song 1')).toBeDefined();
        expect(screen.getByText('Song 2')).toBeDefined();
    });

    it('renders delete modal when a product is selected for deletion', () => {
        const mockProducts: Product[] = [
            { id: 'uuid-1', title: 'Song 1', artistName: 'Artist 1', images: [], createdAt: '', updatedAt: '' },
        ];

        vi.mocked(useProductListMock.useProductList).mockReturnValue({
            searchQuery: '',
            filters: { artistName: '', limit: PRODUCT_LIST_LIMIT },
            setFilters: vi.fn(),
            allProducts: mockProducts,
            isLoading: false,
            isError: false,
            error: null,
            ref: vi.fn(),
            hasNextPage: false,
            isFetchingNextPage: false,
            inView: false,
        } as unknown as ReturnType<typeof useProductListMock.useProductList>);

        vi.mocked(useProductDeletionMock.useProductDeletion).mockReturnValue({
            selectedProduct: mockProducts[0], // Modal should be open
            isDeleting: false,
            handleDeleteRequest: vi.fn(),
            handleDeleteConfirm: vi.fn(),
            handleDeleteCancel: vi.fn(),
        } as unknown as ReturnType<typeof useProductDeletionMock.useProductDeletion>);

        render(
            <TestWrapper>
                <ProductListContainer />
            </TestWrapper>
        );

        expect(screen.getByRole('dialog', { name: /delete product/i })).toBeDefined();
        expect(screen.getByText(/Are you sure you want to delete/i)).toBeDefined();
        expect(screen.getByText(/"Song 1"/i)).toBeDefined();
    });
});
