import React, { useState } from 'react';
import { ArrowRight, Loader2, User as UserIcon } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/routes.constants';

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
        navigate(ROUTES.HOME, { replace: true });
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="username"
          className="block text-[10px] font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest mb-3"
        >
          USER IDENTIFIER
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-indigo-500 dark:text-indigo-400">
            <UserIcon className="w-4 h-4" />
          </div>
          <input
            id="username"
            type="text"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            placeholder="Enter alias"
            disabled={isJoining}
            autoFocus
            className="w-full bg-transparent border-2 border-zinc-900 dark:border-zinc-100 rounded-none py-3.5 pl-11 pr-4 text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:bg-zinc-100 dark:focus:bg-zinc-900 transition-colors disabled:opacity-50"
          />
        </div>
        {joinError && (
          <p className="mt-3 text-[10px] uppercase tracking-widest text-white bg-red-600 px-2 py-1 inline-block font-bold">
            ERROR: {joinError}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isJoining || !usernameInput.trim()}
        className="w-full bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-400 font-bold py-4 px-5 rounded-none flex items-center justify-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs uppercase tracking-widest border-2 border-transparent"
      >
        {isJoining ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>INITIALIZING...</span>
          </>
        ) : (
          <>
            <span>INITIALIZE SESSION</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <p className="text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400 text-center">
        Alias will be attached to all data packets.
      </p>
    </form>
  );
};
