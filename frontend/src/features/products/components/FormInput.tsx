import { memo } from 'react';

interface FormInputProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
    required?: boolean;
}

export const FormInput = memo(function FormInput({
    id,
    label,
    value,
    onChange,
    error,
    placeholder,
    required = true,
}: FormInputProps) {
    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={id} className="text-sm font-medium text-gray-700">
                {label} {required && <span aria-hidden="true" className="text-red-500">*</span>}
            </label>
            <input
                id={id}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                aria-required={required}
                aria-describedby={error ? `${id}-error` : undefined}
                aria-invalid={!!error}
                placeholder={placeholder}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 aria-invalid:border-red-400"
            />
            {error && (
                <p id={`${id}-error`} role="alert" className="text-xs text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
});
