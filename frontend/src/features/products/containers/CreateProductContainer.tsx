import { useNavigate } from 'react-router-dom';
import { useCreateProduct } from '../hooks/useCreateProduct';
import { useDispatch } from 'react-redux';
import { addToast } from '../../../store/slices/uiSlice';
import { ProductForm } from '../components/ProductForm';
import { ProductFormState } from '../reducers/productFormReducer';


export function CreateProductContainer() {
    const navigate = useNavigate();
    const createMutation = useCreateProduct();

    const dispatch = useDispatch();

    const handleSubmit = async (state: ProductFormState) => {
        if (!state.imageMetadata || state.uploadStatus !== 'success') {
            dispatch(addToast({ type: 'info', message: 'Wait for image to finish uploading!' }));
            return;
        }
        await createMutation.mutateAsync({
            title: state.title,
            artistName: state.artistName,
            image: state.imageMetadata,
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
