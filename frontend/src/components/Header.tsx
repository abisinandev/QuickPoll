import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { QuickPollLogo } from './QuickPollLogo';
import { LiveIndicator } from './LiveIndicator';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../store/AuthContext';
import { ROUTES } from '../routes/routes.constants';

export const Header: React.FC = () => {
  let auth: ReturnType<typeof useAuth> | null = null;
  try {
    auth = useAuth();
  } catch {
    auth = null;
  }

  const navigate = useNavigate();
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const confirmLeave = async () => {
    if (!auth) return;
    setIsLeaving(true);
    await auth.leaveUser();
    setIsLeaving(false);
    setShowLeaveConfirm(false);
    navigate(ROUTES.JOIN, { replace: true });
  };

  return (
    <header className="w-full px-6 py-4 bg-white dark:bg-black border-b-2 border-zinc-900 dark:border-zinc-800 sticky top-0 z-20 font-mono">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-zinc-900 dark:text-zinc-100">
          <QuickPollLogo className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          <span className="font-black text-xl tracking-tighter uppercase hidden sm:inline-block">QUICKPOLL</span>
        </div>

        <div className="flex items-center gap-3">
          {auth?.user ? (
            <div className="flex items-center gap-2 px-3 py-1.5 border-2 text-[10px] uppercase font-bold tracking-widest
              bg-transparent border-zinc-900 text-zinc-900
              dark:border-zinc-100 dark:text-zinc-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-zinc-500 dark:text-zinc-400">ALIAS:</span>
              <span>{auth.user.username}</span>
            </div>
          ) : (
            <LiveIndicator />
          )}
          {auth?.user && (
            <button
              type="button"
              onClick={() => setShowLeaveConfirm(true)}
              aria-label="Leave room"
              title="Leave room"
              className="w-9 h-9 flex items-center justify-center border-2 transition-colors cursor-pointer
                bg-transparent border-red-600 text-red-600 hover:bg-red-600 hover:text-white
                dark:border-red-500 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
          <ThemeToggle />
        </div>
      </div>

      {showLeaveConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 font-mono"
          onClick={() => !isLeaving && setShowLeaveConfirm(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white dark:bg-black border-2 border-zinc-900 dark:border-zinc-100 p-8
              shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]"
          >
            <h2 className="text-lg font-black uppercase tracking-widest text-zinc-900 dark:text-white mb-3">
              LEAVE ROOM?
            </h2>
            <p className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8">
              Your session will end and you'll be disconnected from live polls and chat. You'll need to rejoin with an alias to come back.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowLeaveConfirm(false)}
                disabled={isLeaving}
                className="flex-1 py-3 px-4 border-2 border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100
                  text-xs font-bold uppercase tracking-widest hover:bg-zinc-100 dark:hover:bg-zinc-900
                  transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLeave}
                disabled={isLeaving}
                className="flex-1 py-3 px-4 bg-red-600 border-2 border-red-600 text-white
                  text-xs font-bold uppercase tracking-widest hover:bg-red-700 hover:border-red-700
                  transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isLeaving ? 'Leaving...' : 'Leave'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
