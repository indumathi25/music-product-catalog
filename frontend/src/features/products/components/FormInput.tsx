import { memo, forwardRef, InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label: string;
    error?: string;
    required?: boolean;
}

export const FormInput = memo(forwardRef<HTMLInputElement, FormInputProps>(function FormInput({
    id,
    label,
    error,
    required = true,
    className = '',
    ...props
}, ref) {
    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={id} className="text-sm font-medium text-gray-700">
                {label} {required && <span aria-hidden="true" className="text-red-500">*</span>}
            </label>
            <input
                id={id}
                ref={ref}
                aria-required={required}
                aria-describedby={error ? `${id}-error` : undefined}
                aria-invalid={!!error}
                className={`rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 aria-invalid:border-red-400 ${className}`}
                {...props}
            />
            {error && (
                <p id={`${id}-error`} role="alert" className="text-xs text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}));
