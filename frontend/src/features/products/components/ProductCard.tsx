import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
    product: Product;
    onDelete: (product: Product) => void;
}

export function ProductCard({ product, onDelete }: ProductCardProps) {
    return (
        <article
            className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-shadow duration-300"
            aria-label={`${product.name} by ${product.artistName}`}
        >
            <Link to={`/product/${product.id}`} className="flex flex-1 flex-col">
                {/* Cover Art */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                        src={product.coverUrl}
                        alt={`Cover art for ${product.name} by ${product.artistName}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f3f4f6"/%3E%3Ctext x="50" y="55" font-size="30" text-anchor="middle" fill="%23d1d5db"%3E🎵%3C/text%3E%3C/svg%3E';
                        }}
                    />
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col gap-1 p-4">
                    <h3
                        className="truncate font-semibold text-gray-900 text-base leading-tight"
                        title={product.name}
                    >
                        {product.name}
                    </h3>
                    <p className="truncate text-sm text-gray-500" title={product.artistName}>
                        {product.artistName}
                    </p>
                </div>
            </Link>

            {/* Delete Button */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        onDelete(product);
                    }}
                    aria-label={`Delete ${product.name}`}
                    className="rounded-full bg-red-600 p-2 text-white shadow-lg hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-4 w-4"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        </article>
    );
}
