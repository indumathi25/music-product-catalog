import { useNavigate } from 'react-router-dom';
import { ProductListContainer } from '@/features/products/containers/ProductListContainer';

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Music Products</h1>
                <button
                    onClick={() => navigate('/create')}
                    className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 transition-all active:scale-95 sm:px-6"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    <span>Add Product</span>
                </button>
            </div>
            <ProductListContainer />
        </>
    );
}
