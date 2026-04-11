import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar.jsx';
import { Navbar } from './Navbar.jsx';

export const AppShell = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar isMobile isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <Sidebar />

      {/* Navbar */}
      <Navbar onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />

      {/* Main Content */}
      <main className="md:ml-60 mt-16 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-7xl mx-auto px-4 md:px-6 py-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};
