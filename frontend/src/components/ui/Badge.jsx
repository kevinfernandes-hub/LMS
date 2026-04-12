import clsx from 'clsx';

/**
 * Badge component for status, labels, and filters
 * Premium SaaS design with semantic color variants
 */
const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    submitted: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    graded: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'on-time': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    late: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    regraded: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  };

  const sizes = {
    sm: 'px-2.5 py-1 text-xs font-medium',
    md: 'px-3 py-1.5 text-sm font-medium',
    lg: 'px-4 py-2 text-base font-semibold',
  };

  return (
    <span className={clsx(
      'rounded-md inline-flex items-center gap-1.5',
      variants[variant],
      sizes[size],
      className
    )}>
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';

export default Badge;
export { Badge };
