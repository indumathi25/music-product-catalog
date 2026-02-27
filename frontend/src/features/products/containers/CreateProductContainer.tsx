import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateProduct } from '../hooks/useCreateProduct';
import { ProductForm } from '../components/ProductForm';
import { ProductFormState } from '../reducers/productFormReducer';


export function CreateProductContainer() {
    const navigate = useNavigate();
    const createMutation = useCreateProduct();

    const handleSubmit = useCallback(
        async (state: ProductFormState) => {
            if (!state.file) return;
            await createMutation.mutateAsync({
                name: state.name,
                artistName: state.artistName,
                coverArt: state.file,
            });
            navigate('/');
        },
        [createMutation, navigate],
    );

    return (
        <ProductForm
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
            submitLabel="Create Product"
        />
    );
}
