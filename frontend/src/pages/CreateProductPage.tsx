import { CreateProductContainer } from '@/features/products/containers/CreateProductContainer';

export default function CreateProductPage() {
    return (
        <div className="mx-auto max-w-lg">
            <h1 className="mb-8 text-2xl font-bold text-gray-900">Add Product</h1>
            <div className="rounded-2xl bg-white p-8 shadow-md">
                <CreateProductContainer />
            </div>
        </div>
    );
}
