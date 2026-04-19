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
  glass = false,
  ...props
}) => {
  const cardContent = (
    <div
      className={clsx(
        'rounded-xl border shadow-sm transition-all duration-250',
        glass ? 'bg-white/10 backdrop-blur-md border-white/20' : 'bg-transparent border-gray-300',
        'light:bg-white light:border-[#bfc5ce]',
        glass && 'light:bg-white/80 light:backdrop-blur-lg light:border-white/40',
        hoverable && 'hover:shadow-md hover:border-primary-DEFAULT light:hover:border-primary-DEFAULT cursor-pointer',
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
