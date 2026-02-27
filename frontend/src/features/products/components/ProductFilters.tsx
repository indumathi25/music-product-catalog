import { ProductFilterParams } from '../types';

interface ProductFiltersProps {
    filters: ProductFilterParams;
    onFilterChange: (filters: ProductFilterParams) => void;
}

export function ProductFilters({ filters, onFilterChange }: ProductFiltersProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-6">
            <div className="flex flex-1 gap-4 max-w-sm">
                {/* Artist Filter */}
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Filter by artist..."
                        className="block w-full rounded-xl border-0 py-2.5 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-shadow"
                        value={filters.artistName ?? ''}
                        onChange={(e) =>
                            onFilterChange({ ...filters, artistName: e.target.value, page: 1 })
                        }
                    />
                </div>
            </div>
        </div>
    );
}
