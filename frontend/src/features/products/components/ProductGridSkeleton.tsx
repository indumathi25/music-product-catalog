
export function ProductGridSkeleton({ count = 10 }: { count?: number }) {
    return (
        <ul
            role="list"
            aria-label="Loading products"
            aria-busy="true"
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4"
        >
            {Array.from({ length: count }).map((_, i) => (
                <li key={i} role="listitem">
                    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-md">
                        {/* Cover placeholder */}
                        <div className="aspect-square w-full animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]" />
                        {/* Text placeholders */}
                        <div className="flex flex-col gap-2 p-4">
                            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]" />
                            <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]" />
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}
