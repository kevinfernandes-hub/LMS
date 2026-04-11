import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export const Tabs = ({ tabs, defaultTab = 0, onChange, variant = 'underline' }) => {
  const [activeTab, setActiveTab] = React.useState(defaultTab);

  const handleTabChange = (index) => {
    setActiveTab(index);
    onChange?.(index);
  };

  return (
    <div>
      <div className={clsx(
        'flex border-b border-gray-200',
        variant === 'underline' && 'gap-8'
      )}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabChange(index)}
            className={clsx(
              'pb-4 font-medium transition-colors relative',
              activeTab === index
                ? 'text-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            {tab.label}
            {activeTab === index && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full"
              />
            )}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
};
