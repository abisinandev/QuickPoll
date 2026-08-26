import React from 'react';

interface LiveIndicatorProps {
  className?: string;
  showText?: boolean;
}

export const LiveIndicator: React.FC<LiveIndicatorProps> = ({ className = '', showText = true }) => {
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
      bg-emerald-50 border border-emerald-200 text-emerald-700
      dark:bg-emerald-900/30 dark:border-emerald-700/40 dark:text-emerald-400
      ${className}`}>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      {showText && <span className="tracking-wider uppercase text-[10px]">LIVE</span>}
    </div>
  );
};
