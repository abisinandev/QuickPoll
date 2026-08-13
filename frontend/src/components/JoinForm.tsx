import React, { useState } from 'react';
import { ArrowRight, Loader2, User as UserIcon } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import { useNavigate } from 'react-router-dom';

interface JoinFormProps {
  onJoinSuccess?: () => void;
}

export const JoinForm: React.FC<JoinFormProps> = ({ onJoinSuccess }) => {
  let auth: ReturnType<typeof useAuth> | null = null;
  try {
    auth = useAuth();
  } catch {
    auth = null;
  }

  const navigate = useNavigate();

  const [usernameInput, setUsernameInput] = useState<string>('');
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError(null);

    const trimmed = usernameInput.trim();
    if (!trimmed) {
      setJoinError('Please enter your name');
      return;
    }
    if (trimmed.length < 2 || trimmed.length > 30) {
      setJoinError('Name must be between 2 and 30 characters');
      return;
    }

    setIsJoining(true);

    if (auth && auth.joinUser) {
      const result = await auth.joinUser(trimmed);
      setIsJoining(false);

      if (result.success) {
        if (onJoinSuccess) onJoinSuccess();
        navigate('/', { replace: true });
      } else {
        setJoinError(result.message || 'Failed to join QuickPoll. Please try again.');
      }
    } else {
      setTimeout(() => {
        setIsJoining(false);
        if (onJoinSuccess) onJoinSuccess();
      }, 500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="username"
          className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2"
        >
          Your display name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <UserIcon className="w-5 h-5" />
          </div>
          <input
            id="username"
            type="text"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            placeholder="Enter your name"
            disabled={isJoining}
            autoFocus
            className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 shadow-sm focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600/20 dark:focus:ring-indigo-500/20 transition-all disabled:bg-slate-50 dark:disabled:bg-slate-900"
          />
        </div>
        {joinError && (
          <p className="mt-2 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
            <span>⚠️</span> {joinError}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isJoining || !usernameInput.trim()}
        className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold py-3 px-5 rounded-xl shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
      >
        {isJoining ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Joining QuickPoll...</span>
          </>
        ) : (
          <>
            <span>Join QuickPoll</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <p className="text-xs text-slate-500 dark:text-slate-400 text-center leading-relaxed">
        Your name will appear next to your messages and votes.
      </p>
    </form>
  );
};
