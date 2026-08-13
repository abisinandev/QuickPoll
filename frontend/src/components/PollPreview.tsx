import React, { useState, useEffect } from 'react';
import { LiveIndicator } from './LiveIndicator';
import { Users } from 'lucide-react';

export const PollPreview: React.FC = () => {
  const [expressPercent, setExpressPercent] = useState<number>(62);
  const [voterCount, setVoterCount] = useState<number>(24);

  useEffect(() => {
    const interval = setInterval(() => {
      setVoterCount((prev) => (prev === 24 ? 25 : 24));
      setExpressPercent((prev) => (prev === 62 ? 63 : 62));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const nestPercent = 28;
  const fastifyPercent = 100 - expressPercent - nestPercent;

  return (
    <div className="rounded-2xl p-5 shadow-sm space-y-4
      bg-white border border-slate-200
      dark:bg-slate-800/60 dark:border-slate-700/60">
      {/* Poll Header */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-700/60">
        <div className="flex items-center gap-2">
          <LiveIndicator />
          <span className="text-xs font-medium flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <Users className="w-3.5 h-3.5" />
            <span>{voterCount} people voting</span>
          </span>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md
          text-slate-400 bg-slate-100
          dark:text-slate-500 dark:bg-slate-700">
          Preview
        </span>
      </div>

      {/* Question */}
      <h3 className="text-base font-semibold leading-snug text-slate-900 dark:text-slate-100">
        What&apos;s your favorite backend framework?
      </h3>

      {/* Options */}
      <div className="space-y-3">
        {/* Express */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="font-semibold text-slate-900 dark:text-slate-100">Express</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{expressPercent}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
            <div className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${expressPercent}%` }} />
          </div>
        </div>
        {/* NestJS */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-700 dark:text-slate-300">NestJS</span>
            <span className="font-semibold text-slate-600 dark:text-slate-400">{nestPercent}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
            <div className="h-full bg-slate-400 dark:bg-slate-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${nestPercent}%` }} />
          </div>
        </div>
        {/* Fastify */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-700 dark:text-slate-300">Fastify</span>
            <span className="font-semibold text-slate-600 dark:text-slate-400">{fastifyPercent}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
            <div className="h-full bg-slate-300 dark:bg-slate-600 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${fastifyPercent}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};
