import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutGrid,
  BookOpen,
  ClipboardList,
  Calendar,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Avatar } from '../ui/Avatar.jsx';
import { useAuthStore } from '../../store/index.js';
import { useLogout } from '../../hooks/index.js';

const NAV_ITEMS = [
  { id: 'dashboard', icon: LayoutGrid, label: 'Dashboard', href: '/dashboard', roles: ['student', 'teacher', 'admin'] },
  { id: 'student-classes', icon: BookOpen, label: 'My Classes', href: '/student/dashboard', roles: ['student'] },
  { id: 'teacher-classes', icon: BookOpen, label: 'My Classes', href: '/teacher/dashboard', roles: ['teacher'] },
  { id: 'student-transcript', icon: BarChart3, label: 'Grades', href: '/student/transcript', roles: ['student'] },
  { id: 'calendar', icon: Calendar, label: 'Calendar', href: '/calendar', roles: ['student', 'teacher'] },
  { id: 'settings', icon: Settings, label: 'Settings', href: '/settings', roles: ['student', 'teacher', 'admin'] },
];

export const Sidebar = ({ isMobile = false, isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuthStore();
  const { mutate: logout } = useLogout();

  const userRole = user?.role || 'student';
  const filteredItems = NAV_ITEMS.filter(item => item.roles.includes(userRole));

  const content = (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-indigo-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-400 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">📚</span>
          </div>
          <h1 className="text-xl font-bold text-white">Acadify</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.href);

          return (
            <Link
              key={item.id}
              to={item.href}
              onClick={isMobile ? onClose : undefined}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-indigo-500 text-white border-l-4 border-white'
                  : 'text-gray-300 hover:bg-indigo-900/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Card */}
      <div className="p-4 border-t border-indigo-500/20">
        <div className="bg-indigo-900/50 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar name={user?.name} size="sm" />
            <div className="min-w-0">
              <p className="font-medium text-white text-sm truncate">{user?.name}</p>
              <p className="text-xs text-gray-300 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600/30 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
        )}
        <motion.div
          initial={{ x: -280 }}
          animate={{ x: isOpen ? 0 : -280 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed left-0 top-0 bottom-0 w-72 bg-gradient-to-b from-indigo-900 to-indigo-950 z-50 flex flex-col"
        >
          {content}
        </motion.div>
      </>
    );
  }

  return (
    <div className="fixed left-0 top-0 bottom-0 w-60 bg-gradient-to-b from-indigo-900 to-indigo-950 flex flex-col hidden md:flex">
      {content}
    </div>
  );
};
