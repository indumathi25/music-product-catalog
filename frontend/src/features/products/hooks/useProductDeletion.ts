import { useState } from 'react';
import { useDeleteProduct as useDeleteProductMutation } from './useDeleteProduct';
import { Product } from '../types';

export function useProductDeletion() {
    const deleteMutation = useDeleteProductMutation();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const handleDeleteRequest = (product: Product) => {
        setSelectedProduct(product);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedProduct) return;
        await deleteMutation.mutateAsync(selectedProduct.id);
        setSelectedProduct(null);
    };

    const handleDeleteCancel = () => {
        setSelectedProduct(null);
    };

    return {
        selectedProduct,
        isDeleting: deleteMutation.isPending,
        handleDeleteRequest,
        handleDeleteConfirm,
        handleDeleteCancel
    };
}
