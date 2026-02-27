import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import { useUpdateProduct } from '../hooks/useUpdateProduct';
import { ProductForm } from '../components/ProductForm';
import { ProductDetailView } from '../components/ProductDetailView';
import { ProductFormState } from '../reducers/productFormReducer';


export function ProductDetailContainer() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const productId = id ? parseInt(id, 10) : undefined;

    const [isEditing, setIsEditing] = useState(false);

    const { data: product, isLoading: isFetching, isError } = useProduct(productId);
    const updateMutation = useUpdateProduct();

    const handleSubmit = useCallback(
        async (state: ProductFormState) => {
            if (!productId) return;
            await updateMutation.mutateAsync({
                id: productId,
                dto: {
                    name: state.name,
                    artistName: state.artistName,
                    coverArt: state.file || undefined,
                },
            });
            setIsEditing(false); // Return to view mode after save
        },
        [productId, updateMutation],
    );

    const handleCancel = useCallback(() => {
        setIsEditing(false);
    }, []);

    const handleBack = useCallback(() => {
        navigate('/');
    }, [navigate]);

    if (isFetching) {
        return (
            <div className="flex justify-center p-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
            </div>
        );
    }

    if (isError || !product) {
        return (
            <div className="rounded-xl bg-red-50 p-6 text-center text-red-600">
                <p className="font-semibold">Product not found</p>
                <button
                    onClick={handleBack}
                    className="mt-4 text-sm font-medium underline"
                >
                    Back to home
                </button>
            </div>
        );
    }

    if (isEditing) {
        return (
            <div className="mx-auto max-w-lg">
                <h2 className="mb-8 text-2xl font-bold text-gray-900">Edit Product Details</h2>
                <div className="rounded-2xl bg-white p-8 shadow-md ring-1 ring-gray-200">
                    <ProductForm
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        isLoading={updateMutation.isPending}
                        initialData={product}
                        submitLabel="Save Changes"
                    />
                </div>
            </div>
        );
    }

    return (
        <ProductDetailView
            product={product}
            onEdit={() => setIsEditing(true)}
            onBack={handleBack}
        />
    );
}
