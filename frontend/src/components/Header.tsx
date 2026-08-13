import React from 'react';
import { QuickPollLogo } from './QuickPollLogo';
import { LiveIndicator } from './LiveIndicator';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../store/AuthContext';

export const Header: React.FC = () => {
  let auth: ReturnType<typeof useAuth> | null = null;
  try {
    auth = useAuth();
  } catch {
    auth = null;
  }

  return (
    <header className="w-full px-6 py-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200/60 dark:border-slate-800/60 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <QuickPollLogo size="md" />

        <div className="flex items-center gap-3">
          {auth?.user ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs shadow-sm
              bg-white border border-slate-200
              dark:bg-slate-800 dark:border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-slate-500 dark:text-slate-400 font-medium">Signed in as</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{auth.user.username}</span>
            </div>
          ) : (
            <LiveIndicator />
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
