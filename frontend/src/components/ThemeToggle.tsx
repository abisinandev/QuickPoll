import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../store/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      className="w-9 h-9 flex items-center justify-center rounded-xl border transition-all cursor-pointer
        bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm
        dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
    >
      {theme === 'dark'
        ? <Sun className="w-4 h-4 text-amber-400" />
        : <Moon className="w-4 h-4 text-indigo-600" />
      }
    </button>
  );
};
