import { Product } from '../types';

interface ProductDetailViewProps {
    product: Product;
    onEdit: () => void;
    onBack: () => void;
}

export function ProductDetailView({ product, onEdit, onBack }: ProductDetailViewProps) {
    return (
        <div className="flex flex-col gap-8 md:flex-row md:items-start lg:gap-12">
            {/* Cover Art Section */}
            <div className="w-full md:w-1/2 lg:w-2/5">
                <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-lg ring-1 ring-gray-200">
                    <img
                        src={product.coverUrl}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                </div>
            </div>

            {/* Info Section */}
            <div className="flex flex-1 flex-col gap-6">
                <div>
                    <button
                        onClick={onBack}
                        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Catalog
                    </button>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{product.name}</h1>
                    <p className="mt-2 text-xl font-medium text-violet-600">{product.artistName}</p>
                </div>

                <div className="border-t border-gray-100 pt-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Added on</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {new Date(product.createdAt).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Last updated</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {new Date(product.updatedAt).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </dd>
                        </div>
                    </dl>
                </div>

                <div className="mt-8 flex gap-4">
                    <button
                        onClick={onEdit}
                        className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 transition-all active:scale-95"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Details
                    </button>
                </div>
            </div>
        </div>
    );
}
