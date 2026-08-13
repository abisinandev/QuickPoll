import React from 'react';
import { Vote } from 'lucide-react';

interface QuickPollLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const QuickPollLogo: React.FC<QuickPollLogoProps> = ({ className = '', size = 'md' }) => {
  const iconSizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };
  const textSizes = { sm: 'text-base', md: 'text-lg', lg: 'text-xl' };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="p-2 bg-indigo-600 rounded-xl shadow-sm text-white flex items-center justify-center">
        <Vote className={iconSizes[size]} />
      </div>
      <span className={`font-bold tracking-tight text-slate-900 dark:text-white ${textSizes[size]}`}>
        QuickPoll
      </span>
    </div>
  );
};
