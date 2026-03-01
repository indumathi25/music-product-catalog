import { useState, useCallback } from 'react';
import { useDeleteProduct as useDeleteProductMutation } from './useDeleteProduct';
import { Product } from '../types';

export function useProductDeletion() {
    const deleteMutation = useDeleteProductMutation();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const handleDeleteRequest = useCallback((product: Product) => {
        setSelectedProduct(product);
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        if (!selectedProduct) return;
        await deleteMutation.mutateAsync(selectedProduct.id);
        setSelectedProduct(null);
    }, [selectedProduct, deleteMutation]);

    const handleDeleteCancel = useCallback(() => {
        setSelectedProduct(null);
    }, []);

    return {
        selectedProduct,
        isDeleting: deleteMutation.isPending,
        handleDeleteRequest,
        handleDeleteConfirm,
        handleDeleteCancel
    };
}
