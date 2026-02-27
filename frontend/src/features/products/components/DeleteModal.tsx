import { useEffect, useRef } from 'react';
import { Product } from '../types';

interface DeleteModalProps {
    product: Product | null;
    isDeleting: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function DeleteModal({ product, isDeleting, onConfirm, onCancel }: DeleteModalProps) {
    const cancelRef = useRef<HTMLButtonElement>(null);

    // Focus cancel button when modal opens
    useEffect(() => {
        if (product) {
            cancelRef.current?.focus();
        }
    }, [product]);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && product) onCancel();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [product, onCancel]);

    if (!product) return null;

    return (
        <div
            role="presentation"
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={onCancel}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

            {/* Dialog */}
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
                className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-red-600" aria-hidden="true">
                            <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h2 id="delete-dialog-title" className="font-semibold text-gray-900">
                        Delete Product
                    </h2>
                </div>

                <p id="delete-dialog-description" className="mb-6 text-sm text-gray-600">
                    Are you sure you want to delete{' '}
                    <strong className="font-semibold text-gray-900">"{product.name}"</strong> by{' '}
                    <strong className="font-semibold text-gray-900">{product.artistName}</strong>? This
                    action cannot be undone.
                </p>

                <div className="flex gap-3">
                    <button
                        ref={cancelRef}
                        type="button"
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gray-400 disabled:opacity-60"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        aria-disabled={isDeleting}
                        className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 disabled:opacity-60"
                    >
                        {isDeleting ? 'Deleting…' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}
