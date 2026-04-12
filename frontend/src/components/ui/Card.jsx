import clsx from 'clsx';
import { motion } from 'framer-motion';

/**
 * Card component - container for grouped content
 * Premium SaaS design with optional hover effects
 */
const Card = ({
  children,
  className = '',
  hoverable = false,
  animated = false,
  ...props
}) => {
  const cardContent = (
    <div
      className={clsx(
        'bg-white rounded-md border border-gray-200 shadow-xs',
        'transition-all duration-250',
        'dark:bg-gray-950 dark:border-gray-800',
        hoverable && 'hover:shadow-sm hover:border-gray-300 dark:hover:border-gray-700 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
};

Card.displayName = 'Card';

export default Card;
export { Card };
