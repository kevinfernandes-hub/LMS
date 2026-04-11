import clsx from 'clsx';

export const Card = ({
  children,
  className = '',
  hoverable = false,
  ...props
}) => (
  <div
    className={clsx(
      'bg-white rounded-xl border border-gray-100 p-6',
      'shadow-sm transition-all duration-200',
      hoverable && 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer',
      className
    )}
    {...props}
  >
    {children}
  </div>
);
