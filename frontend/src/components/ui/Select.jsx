import { forwardRef } from 'react';
import clsx from 'clsx';

export const Select = forwardRef(({ 
  label, 
  error, 
  options = [],
  ...props 
}, ref) => (
  <div className="flex flex-col gap-2">
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <select
      ref={ref}
      className={clsx(
        'px-4 py-2 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500',
        error ? 'border-red-500' : 'border-gray-300',
        'hover:border-gray-400'
      )}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <span className="text-sm text-red-600">{error}</span>}
  </div>
));
