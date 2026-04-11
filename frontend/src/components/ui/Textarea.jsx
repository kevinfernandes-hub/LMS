import { forwardRef } from 'react';
import clsx from 'clsx';

export const Textarea = forwardRef(({ 
  label, 
  error, 
  ...props 
}, ref) => (
  <div className="flex flex-col gap-2">
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <textarea
      ref={ref}
      className={clsx(
        'px-4 py-2 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none',
        error ? 'border-red-500' : 'border-gray-300',
        'hover:border-gray-400'
      )}
      {...props}
    />
    {error && <span className="text-sm text-red-600">{error}</span>}
  </div>
));
