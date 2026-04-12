import { useNavigate } from 'react-router-dom';
import { useCreateProduct } from '../hooks/useCreateProduct';
import { ProductForm } from '../components/ProductForm';
import { ProductFormValues } from '../hooks/useProductForm';


export function CreateProductContainer() {
    const navigate = useNavigate();
    const createMutation = useCreateProduct();

    const handleSubmit = async (values: ProductFormValues) => {
        await createMutation.mutateAsync({
            title: values.title,
            artistName: values.artistName,
            image: values.imageMetadata!,
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
