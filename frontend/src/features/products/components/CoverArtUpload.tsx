import { useRef, useCallback, memo } from 'react';

interface CoverArtUploadProps {
    preview: string | null;
    fileName?: string;
    error?: string;
    onFileSelect: (file: File) => void;
    onClear: () => void;
}

export const CoverArtUpload = memo(function CoverArtUpload({
    preview,
    fileName,
    error,
    onFileSelect,
    onClear,
}: CoverArtUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) onFileSelect(file);
        },
        [onFileSelect],
    );

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

    return (
        <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">
                Cover Art <span aria-hidden="true" className="text-red-500">*</span>
            </span>
            <div
                role="button"
                tabIndex={0}
                aria-label="Upload cover art. Drag and drop an image or press Enter to browse."
                aria-describedby={error ? 'file-error' : 'file-hint'}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
                }}
                className="relative flex min-h-48 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition hover:border-violet-400 hover:bg-violet-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500"
            >
                {preview ? (
                    <>
                        <img
                            src={preview}
                            alt="Cover art preview"
                            className="h-36 w-36 rounded-lg object-cover shadow"
                        />
                        <p className="text-xs text-gray-500">{fileName}</p>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClear();
                            }}
                            aria-label="Remove selected image"
                            className="text-xs text-red-500 underline hover:text-red-700"
                        >
                            Remove
                        </button>
                    </>
                ) : (
                    <>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
                                <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p id="file-hint" className="text-center text-sm text-gray-500">
                            <span className="font-medium text-violet-600">Browse</span> or drag &amp; drop
                        </p>
                        <p className="text-xs text-gray-400">JPEG, PNG, WebP · max 5 MB</p>
                    </>
                )}
            </div>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                aria-hidden="true"
                tabIndex={-1}
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onFileSelect(file);
                }}
            />
            {error && (
                <p id="file-error" role="alert" className="text-xs text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
});
