import clsx from 'clsx';

const COLORS = ['bg-indigo-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500', 'bg-sky-500', 'bg-violet-500', 'bg-teal-500', 'bg-orange-500'];

function getInitials(name) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getColorForName(name) {
  const hash = name.charCodeAt(0);
  return COLORS[hash % COLORS.length];
}

export const Avatar = ({
  src,
  alt = '',
  name = 'User',
  size = 'md',
  className = '',
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={clsx('rounded-full object-cover', sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={clsx(
        'rounded-full flex items-center justify-center font-semibold text-white',
        sizes[size],
        getColorForName(name),
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
};
