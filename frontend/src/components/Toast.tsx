import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { removeToast, Toast as ToastType } from '../store/slices/uiSlice';

export function Toast({ id, message, type }: ToastType) {
    const dispatch = useDispatch();

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(removeToast(id));
        }, 5000);
        return () => clearTimeout(timer);
    }, [id, dispatch]);

    const bgColors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
    };

    return (
        <div
            role="alert"
            className={`flex min-w-64 items-center justify-between gap-3 rounded-lg p-4 text-white shadow-lg animate-in fade-in slide-in-from-right-5 ${bgColors[type]}`}
        >
            <p className="text-sm font-medium">{message}</p>
            <button
                onClick={() => dispatch(removeToast(id))}
                aria-label="Close notification"
                className="text-white/80 hover:text-white"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5"
                >
                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
            </button>
        </div>
    );
}
