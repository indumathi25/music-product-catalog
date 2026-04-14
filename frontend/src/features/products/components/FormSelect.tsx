import { memo, forwardRef, SelectHTMLAttributes } from 'react';

export interface FormSelectOption {
  value: string;
  label: string;
}

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  options: FormSelectOption[];
  error?: string;
  required?: boolean;
  placeholder?: string;
}

const FormSelectInner = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ id, label, options, error, required = true, placeholder = 'Select an option', className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label htmlFor={id} className="text-sm font-semibold text-slate-700">
          {label} {required && <span aria-hidden="true" className="text-red-500">*</span>}
        </label>
        <div className="relative group">
          <select
            id={id}
            ref={ref}
            aria-required={required}
            aria-describedby={error ? `${id}-error` : undefined}
            aria-invalid={!!error}
            defaultValue=""
            className={`
              w-full appearance-none rounded-xl border border-slate-200 bg-white
              px-4 py-3 text-sm text-slate-900 transition-all duration-200
              placeholder:text-slate-400
              hover:border-slate-300
              focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10
              disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60
              aria-invalid:border-red-400 aria-invalid:focus:ring-red-500/10
              ${className}
            `}
            {...props}
          >
            <option value="" disabled hidden>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 group-hover:text-slate-500 transition-colors">
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
        {error && (
          <p id={`${id}-error`} role="alert" className="mt-1 text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormSelectInner.displayName = 'FormSelect';

export const FormSelect = memo(FormSelectInner);
