import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm group"
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
      ) : (
        <Moon className="w-5 h-5 text-slate-600 group-hover:scale-110 transition-transform" />
      )}
    </button>
  );
};

export default ThemeToggle;
