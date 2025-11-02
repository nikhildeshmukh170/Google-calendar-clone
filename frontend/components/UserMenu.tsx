'use client';

import { useState, useEffect, useRef } from 'react';
import { User } from '@/lib/api/userClient';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

interface UserMenuProps {
  currentUser: User | null;
  onUserSelect: (user: User | null) => void;
  onSwitchUser: () => void;
}

export default function UserMenu({ currentUser, onUserSelect, onSwitchUser }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    onUserSelect(null);
    localStorage.removeItem('currentUser');
    setIsOpen(false);
    toast.success('Logged out successfully');
  };

  const handleSwitchUser = () => {
    setIsOpen(false);
    onSwitchUser();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm">
          {(currentUser?.name?.charAt(0) || '?').toString().toUpperCase()}
        </div>
        <div className="text-left">
          <div className="text-sm font-semibold">{currentUser?.name ?? 'Guest'}</div>
          <div className="text-xs opacity-90">{currentUser?.email ?? ''}</div>
        </div>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 bottom-full mb-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center font-bold text-xl text-white shadow-lg">
                  {(currentUser?.name?.charAt(0) || '?').toString().toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">
                    {currentUser?.name ?? 'Guest'}
                  </div>
                  <div className="text-sm opacity-90 truncate">
                    {currentUser?.email ?? ''}
                  </div>
                </div>
                <div className="ml-2">
                  <button
                    onClick={() => { setIsOpen(false); /* placeholder for manage account */ }}
                    className="text-xs font-medium px-2 py-1 rounded-md bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    Manage
                  </button>
                </div>
              </div>
            </div>

            <div className="py-2">
              <button
                onClick={handleSwitchUser}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 group"
              >
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
                <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Switch User
                </span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3 group"
              >
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  Logout
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


