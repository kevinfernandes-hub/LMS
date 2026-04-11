import clsx from 'clsx';

export const Badge = ({
  children,
  variant = 'gray',
  size = 'md',
  className = '',
}) => {
  const variants = {
    gray: 'bg-gray-100 text-gray-800',
    indigo: 'bg-indigo-100 text-indigo-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    amber: 'bg-amber-100 text-amber-800',
    blue: 'bg-blue-100 text-blue-800',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <span className={clsx(
      'font-semibold rounded-full inline-block',
      variants[variant],
      sizes[size],
      className
    )}>
      {children}
    </span>
  );
};
