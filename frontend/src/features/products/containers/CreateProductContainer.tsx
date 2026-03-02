import { useNavigate } from 'react-router-dom';
import { useCreateProduct } from '../hooks/useCreateProduct';
import { ProductForm } from '../components/ProductForm';
import { ProductFormState } from '../reducers/productFormReducer';


export function CreateProductContainer() {
    const navigate = useNavigate();
    const createMutation = useCreateProduct();

    const handleSubmit = async (state: ProductFormState) => {
        if (!state.file) return;
        await createMutation.mutateAsync({
            title: state.title,
            artistName: state.artistName,
            coverArt: state.file,
        });
        navigate('/');
    };

    return (
        <ProductForm
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
            submitLabel="Create Product"
        />
    );
}
