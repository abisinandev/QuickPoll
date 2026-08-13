import React from 'react';
import { PollPreview } from './PollPreview';
import { ChatPreview } from './ChatPreview';

export const ProductPreview: React.FC = () => {
  return (
    <div className="w-full max-w-lg mx-auto bg-slate-100/80 dark:bg-slate-900/60 p-4 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-4 relative overflow-hidden">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Live Product Demo
        </span>
        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
          Interactive preview
        </span>
      </div>

      <PollPreview />
      <ChatPreview />
    </div>
  );
};
