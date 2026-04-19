import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import Sidebar from './Sidebar.jsx';
import Navbar from './Navbar.jsx';

/**
 * AppShell - main application layout wrapper
 * Combines Sidebar, Navbar, and content area
 * Premium SaaS design with responsive layout
 */
const AppShell = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex">
      {/* Sidebar - Desktop & Mobile */}
      <Sidebar isMobile isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <Sidebar />

      {/* Main Layout */}
      <div className="flex-1 flex flex-col md:ml-60">
        {/* Header - Subtle & Integrated */}
        <div className="h-16 flex items-center justify-between px-8 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-30">
          <div className="md:hidden flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-[#4B2676]" />
            <span className="font-black text-[#1E1B4B]">Acadify</span>
          </div>
          <div className="hidden md:block">
            {/* Breadcrumb placeholder or dynamic title could go here */}
          </div>
          <div className="flex items-center gap-4">
            {/* Action buttons could go here */}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
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
    </div>
  );
};

AppShell.displayName = 'AppShell';

export default AppShell;
export { AppShell, Sidebar, Navbar };
