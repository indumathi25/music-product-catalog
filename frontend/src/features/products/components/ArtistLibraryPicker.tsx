import { ArtistImage } from '../types';

interface ArtistLibraryPickerProps {
    images: ArtistImage[];
    selectedUrl: string | null;
    onSelect: (image: ArtistImage) => void;
}

export function ArtistLibraryPicker({ images, selectedUrl, onSelect }: ArtistLibraryPickerProps) {
    if (images.length === 0) return null;

    return (
        <div className="mt-3">
            <p className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Reuse from artist library
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {images.map((img) => {
                    const isSelected = img.url === selectedUrl;
                    return (
                        <button
                            key={img.id}
                            type="button"
                            onClick={() => onSelect(img)}
                            className={`relative flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                                isSelected
                                    ? 'border-violet-500 ring-2 ring-violet-300 scale-105'
                                    : 'border-transparent hover:border-violet-300 hover:scale-105'
                            }`}
                            title={`Use this image`}
                            aria-pressed={isSelected}
                        >
                            <img
                                src={img.url}
                                alt="Artist library image"
                                className="h-16 w-16 object-cover"
                                loading="lazy"
                            />
                            {isSelected && (
                                <div className="absolute inset-0 flex items-center justify-center bg-violet-600/30">
                                    <svg className="h-5 w-5 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
