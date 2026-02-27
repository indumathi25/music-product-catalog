import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
    products: Product[];
    onDelete: (product: Product) => void;
}

export function ProductGrid({ products, onDelete }: ProductGridProps) {
    return (
        <ul
            role="list"
            aria-label="Products"
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4"
        >
            {products.map((product) => (
                <li key={product.id} role="listitem">
                    <ProductCard product={product} onDelete={onDelete} />
                </li>
            ))}
        </ul>
    );
}
