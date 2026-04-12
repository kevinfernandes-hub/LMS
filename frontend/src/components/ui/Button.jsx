import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

/**
 * Button component with multiple variants, sizes, and states
 * Premium SaaS design with smooth animations
 * 
 * @param {string} variant - 'primary' | 'secondary' | 'ghost' | 'danger'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} isLoading - Shows loading spinner when true
 * @param {boolean} disabled - Disables the button
 * @param {React.ReactNode} icon - Optional icon element
 * @param {string} className - Additional classes
 * @param {React.ReactNode} children - Button label/content
 * @param {React.ComponentType} as - Component to render as (default: 'button')
 */
const Button = React.forwardRef(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      icon = null,
      className,
      children,
      as: Component = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    // Base styles with new design tokens
    const baseStyles =
      'relative inline-flex items-center justify-center font-inter font-medium transition-all duration-250 rounded-md focus-ring cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

    // Size variants
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm gap-2',
      md: 'px-4 py-2.5 text-base gap-2.5',
      lg: 'px-6 py-3 text-lg gap-3',
    };

    // Variant styles using new design tokens
    const variantStyles = {
      primary: `
        bg-gradient-to-r from-accent-600 to-accent-700 text-white
        hover:from-accent-700 hover:to-accent-800
        active:from-accent-800 active:to-accent-900
        shadow-sm hover:shadow-md
        disabled:from-gray-300 disabled:to-gray-400
      `,
      secondary: `
        bg-gray-100 text-gray-900
        hover:bg-gray-200
        active:bg-gray-300
        shadow-xs
        dark:bg-gray-800 dark:text-gray-100
        dark:hover:bg-gray-700
        dark:active:bg-gray-600
      `,
      ghost: `
        text-gray-700 bg-transparent
        hover:bg-gray-100
        active:bg-gray-200
        dark:text-gray-300
        dark:hover:bg-gray-900
        dark:active:bg-gray-800
      `,
      danger: `
        bg-red-600 text-white
        hover:bg-red-700
        active:bg-red-800
        shadow-sm hover:shadow-md
        disabled:bg-gray-300
      `,
    };

    return (
      <Component
        ref={ref}
        disabled={isDisabled}
        className={clsx(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          className
        )}
        {...props}
      >
        <motion.span
          initial={false}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 0.15 }}
          className="flex items-center justify-center gap-inherit"
        >
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </motion.span>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin-fast" />
          </motion.div>
        )}
      </Component>
    );
  }
);

Button.displayName = 'Button';

export default Button;
export { Button };
