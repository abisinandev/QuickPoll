import React from 'react';
import { Vote } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4
      bg-[#F8FAFC] dark:bg-slate-950">
      <div className="p-3 bg-indigo-600 rounded-2xl shadow-md shadow-indigo-600/25 text-white">
        <Vote className="w-7 h-7" />
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-base font-semibold text-slate-700 dark:text-slate-300">{message}</span>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
};
