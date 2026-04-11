import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu } from 'lucide-react';
import { Avatar } from '../ui/Avatar.jsx';
import { useAuthStore } from '../../store/index.js';
import { useLogout, useUnreadCount } from '../../hooks/index.js';

export const Navbar = ({ onMenuClick }) => {
  const { user } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { mutate: logout } = useLogout();
  const { data: unreadCount } = useUnreadCount();

  return (
    <div className="fixed top-0 right-0 left-0 md:left-60 h-16 bg-white border-b border-gray-200 z-30 flex items-center justify-between px-6 gap-4">
      {/* Left - Menu & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>

        <div className="hidden md:flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2 flex-1 max-w-xs">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search classes, assignments..."
            className="bg-transparent outline-none text-sm text-gray-600 flex-1"
          />
        </div>
      </div>

      {/* Right - Notifications & Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          type="button"
          onClick={() => navigate('/student/dashboard')}
          className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          {typeof unreadCount === 'number' && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Avatar name={user?.name} size="sm" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-40">
              <Link
                to="/profile"
                onClick={() => setIsProfileOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setIsProfileOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Settings
              </Link>
              <hr className="my-2" />
              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(false);
                  logout();
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
