import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, LogOut as LogOutIcon, Settings as SettingsIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import Avatar from '../ui/Avatar.jsx';
import { useAuthStore } from '../../store/index.js';
import { useLogout, useUnreadCount } from '../../hooks/index.js';

/**
 * Navbar component - top navigation bar
 * Premium SaaS design with notifications and profile menu
 */
const Navbar = ({ onMenuClick }) => {
  const { user } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { mutate: logout } = useLogout();
  const { data: unreadCount } = useUnreadCount();

  return (
    <div className={clsx(
      'fixed top-0 right-0 left-0 md:left-60 h-16',
      'bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800',
      'z-30 flex items-center justify-between px-6 gap-4',
      'shadow-xs transition-all duration-250'
    )}>
      {/* Left - Menu & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className={clsx(
            'md:hidden p-2 rounded-md transition-colors',
            'hover:bg-gray-100 dark:hover:bg-gray-900',
            'text-gray-700 dark:text-gray-300'
          )}
        >
          <Menu className="w-6 h-6" strokeWidth={2} />
        </button>

        {/* Search Bar */}
        <div className={clsx(
          'hidden md:flex items-center gap-3',
          'bg-gray-100 dark:bg-gray-900',
          'border border-gray-200 dark:border-gray-800',
          'rounded-lg px-4 py-2.5 flex-1 max-w-xs',
          'transition-colors duration-250',
          'focus-within:ring-2 focus-within:ring-accent-500/50'
        )}>
          <Search className="w-5 h-5 text-gray-400 dark:text-gray-500" strokeWidth={2} />
          <input
            type="text"
            placeholder="Search classes, assignments..."
            className={clsx(
              'bg-transparent outline-none text-sm text-gray-600 dark:text-gray-400',
              'placeholder-gray-400 dark:placeholder-gray-600',
              'flex-1'
            )}
          />
        </div>
      </div>

      {/* Right - Notifications & Profile */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => navigate('/student/dashboard')}
          className={clsx(
            'relative p-2.5 rounded-md transition-colors',
            'hover:bg-gray-100 dark:hover:bg-gray-900',
            'text-gray-700 dark:text-gray-300'
          )}
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" strokeWidth={2} />
          {typeof unreadCount === 'number' && unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={clsx(
                'absolute -top-1 -right-1 min-w-[20px] h-5 px-1',
                'bg-red-500 text-white text-xs font-semibold',
                'rounded-full flex items-center justify-center',
                'shadow-lg'
              )}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.span>
          )}
        </motion.button>

        {/* Profile Menu */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={clsx(
              'flex items-center gap-2 px-2 py-1 rounded-md',
              'hover:bg-gray-100 dark:hover:bg-gray-900',
              'transition-colors'
            )}
          >
            <Avatar name={user?.name} size="sm" />
            <div className="hidden sm:flex flex-col items-start">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
            </div>
          </motion.button>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                onClick={(e) => e.stopPropagation()}
                className={clsx(
                  'absolute right-0 mt-2 w-56 rounded-lg',
                  'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800',
                  'shadow-lg z-40 overflow-hidden'
                )}
              >
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize mt-1">{user?.role}</p>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <Link
                    to="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className={clsx(
                      'flex items-center gap-3 px-4 py-2.5 text-sm',
                      'text-gray-700 dark:text-gray-300',
                      'hover:bg-gray-100 dark:hover:bg-gray-800',
                      'transition-colors'
                    )}
                  >
                    <div className="w-4 h-4">👤</div>
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className={clsx(
                      'flex items-center gap-3 px-4 py-2.5 text-sm',
                      'text-gray-700 dark:text-gray-300',
                      'hover:bg-gray-100 dark:hover:bg-gray-800',
                      'transition-colors'
                    )}
                  >
                    <SettingsIcon className="w-4 h-4" strokeWidth={2} />
                    Settings
                  </Link>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-800" />

                {/* Logout */}
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                  className={clsx(
                    'w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium',
                    'text-red-600 dark:text-red-400',
                    'hover:bg-red-50 dark:hover:bg-red-900/20',
                    'transition-colors'
                  )}
                >
                  <LogOutIcon className="w-4 h-4" strokeWidth={2} />
                  Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

Navbar.displayName = 'Navbar';

export default Navbar;
export { Navbar };
