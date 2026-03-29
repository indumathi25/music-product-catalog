import { useNavigate } from 'react-router-dom';
import { useProductList } from '../hooks/useProductList';
import { useProductDeletion } from '../hooks/useProductDeletion';
import { ProductGrid } from '../components/ProductGrid';
import { ProductGridSkeleton } from '../components/ProductGridSkeleton';
import { DeleteModal } from '../components/DeleteModal';
import { ProductFilters } from '../components/ProductFilters';
import { EmptyState } from '@/components/EmptyState';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store';
import { clearSearchQuery } from '@/store/slices/productSlice';
import { MESSAGES, PRODUCT_LIST_LIMIT } from '@/constants';

export function ProductListContainer() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const {
        searchQuery,
        filters,
        setFilters,
        allProducts,
        filteredProducts,
        isLoading,
        isError,
        error,
        ref,
        hasNextPage,
        isFetchingNextPage
    } = useProductList();

    const {
        selectedProduct,
        isDeleting,
        handleDeleteRequest,
        handleDeleteConfirm,
        handleDeleteCancel
    } = useProductDeletion();

    if (isLoading && !allProducts.length) return <ProductGridSkeleton count={PRODUCT_LIST_LIMIT} />;

    if (isError) {
        return (
            <div role="alert" className="rounded-xl bg-red-50 p-6 text-center text-red-600">
                <p className="font-semibold">Failed to load products</p>
                <p className="mt-1 text-sm text-red-500">
                    {error instanceof Error ? error.message : 'An unexpected error occurred'}
                </p>
            </div>
        );
    }

    const hasFilters = searchQuery || filters.artistName;

    return (
        <div className="flex flex-col gap-6">
            <ProductFilters
                filters={filters}
                onFilterChange={setFilters}
                productCount={{ loaded: allProducts.length, filtered: filteredProducts.length }}
            />

            {!filteredProducts.length && !isLoading ? (
                <EmptyState
                    title={hasFilters ? MESSAGES.PRODUCT_LIST.EMPTY_FILTERED : MESSAGES.PRODUCT_LIST.EMPTY_ALL}
                    description={
                        hasFilters
                            ? MESSAGES.PRODUCT_LIST.EMPTY_FILTERED_DESC
                            : MESSAGES.PRODUCT_LIST.EMPTY_ALL_DESC
                    }
                    action={
                        hasFilters
                            ? {
                                label: 'Clear filters',
                                onClick: () => {
                                    setFilters({ limit: PRODUCT_LIST_LIMIT, artistName: '' });
                                    dispatch(clearSearchQuery());
                                }
                            }
                            : { label: 'Add Product', onClick: () => navigate('/create') }
                    }
                />
            ) : (
                <>
                    <ProductGrid products={filteredProducts} onDelete={handleDeleteRequest} />

                    {/* Intersection Observer Anchor */}
                    <div ref={ref} className="h-10 w-full flex items-center justify-center">
                        {isFetchingNextPage && (
                            <div className="flex flex-col items-center gap-2">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
                                <span className="text-xs text-gray-500 font-medium">{MESSAGES.PRODUCT_LIST.LOADING_MORE}</span>
                            </div>
                        )}
                        {!hasNextPage && allProducts.length > 0 && (
                            <p className="text-sm text-gray-400 font-medium">{MESSAGES.PRODUCT_LIST.END_OF_CATALOG}</p>
                        )}
                    </div>
                </>
            )}

            <DeleteModal
                product={selectedProduct}
                isDeleting={isDeleting}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />
        </div>
    );
}
