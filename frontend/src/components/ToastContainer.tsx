import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Toast } from './Toast';

export function ToastContainer() {
    const toasts = useSelector((state: RootState) => state.ui.toasts);

    return (
        <div
            aria-live="polite"
            className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3"
        >
            {toasts.map((toast) => (
                <Toast key={toast.id} {...toast} />
            ))}
        </div>
    );
}
