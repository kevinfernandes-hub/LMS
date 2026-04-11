import clsx from 'clsx';

export const Skeleton = ({ className = '', count = 1, ...props }) => {
  return (
    <div {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={clsx(
            'bg-gray-200 animate-pulse rounded',
            className
          )}
        />
      ))}
    </div>
  );
};

export const SkeletonCard = ({ count = 1 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
        <Skeleton className="h-4 w-32 mb-4" />
        <Skeleton className="h-3 w-full mb-2" count={2} />
      </div>
    ))}
  </>
);
