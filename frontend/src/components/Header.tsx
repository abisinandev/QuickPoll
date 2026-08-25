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
    <header className="w-full px-6 py-4 bg-white dark:bg-black border-b-2 border-zinc-900 dark:border-zinc-800 sticky top-0 z-20 font-mono">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-zinc-900 dark:text-zinc-100">
          <QuickPollLogo className="w-8 h-8" />
          <span className="font-black text-xl tracking-tighter uppercase hidden sm:inline-block">QUICKPOLL</span>
        </div>

        <div className="flex items-center gap-3">
          {auth?.user ? (
            <div className="flex items-center gap-2 px-3 py-1.5 border-2 text-[10px] uppercase font-bold tracking-widest
              bg-transparent border-zinc-900 text-zinc-900
              dark:border-zinc-100 dark:text-zinc-100">
              <span className="w-2 h-2 bg-black dark:bg-white animate-pulse" />
              <span className="text-zinc-500 dark:text-zinc-400">ALIAS:</span>
              <span>{auth.user.username}</span>
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
