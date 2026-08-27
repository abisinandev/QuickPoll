import React from 'react';
import { Header } from '../components/Header';
import { JoinForm } from '../components/JoinForm';
import { ProductPreview } from '../components/ProductPreview';
import { Terminal, Code, Cpu } from 'lucide-react';
import { FeaturePillProps } from '../types/join-page.types';

const FeaturePill: React.FC<FeaturePillProps> = ({ icon, label }) => (
  <div className="inline-flex items-center gap-2 px-3 py-1.5 border-2 border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100 text-[10px] font-bold uppercase tracking-widest bg-transparent">
    {icon}
    <span>{label}</span>
  </div>
);

export const JoinPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col font-mono selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Minimal Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 flex items-center border-t-2 border-zinc-900 dark:border-zinc-800">
        <div className="w-full max-w-6xl mx-auto px-6 py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* ─── LEFT COLUMN: Copy + Form ─── */}
            <div className="w-full lg:w-[45%] flex flex-col gap-10">
              {/* Kicker */}
              <div className="inline-flex items-center gap-2 w-fit text-[10px] uppercase tracking-widest font-bold bg-zinc-900 text-white dark:bg-white dark:text-black px-2 py-1">
                <Terminal className="w-3 h-3" />
                SYSTEM READY // WAITING FOR CONNECTION
              </div>

              {/* Hero Headline */}
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-6xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter leading-none">
                  VOTE. <br/>
                  OBSERVE. <br/>
                  <span className="text-zinc-400 dark:text-zinc-500">EXECUTE.</span>
                </h1>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-md uppercase tracking-wider">
                  Real-time polling application. Discuss your thoughts. Connect for free.
                </p>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3">
                <FeaturePill
                  icon={<Terminal className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />}
                  label="LIVE_POLL"
                />
                <FeaturePill
                  icon={<Code className="w-4 h-4 text-violet-600 dark:text-violet-400" />}
                  label="SYNC_CHAT"
                />
                <FeaturePill
                  icon={<Cpu className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                  label="ZERO_LATENCY"
                />
              </div>

              {/* Divider */}
              <div className="w-full h-0.5 bg-zinc-900 dark:bg-zinc-800" />

              {/* Join Form Card */}
              <div className="bg-transparent border-2 border-zinc-900 dark:border-zinc-800 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]">
                <JoinForm />
              </div>
            </div>

            {/* ─── RIGHT COLUMN: Product Preview ─── */}
            <div className="w-full lg:w-[55%] flex items-center justify-center grayscale contrast-125">
              <ProductPreview />
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t-2 border-zinc-900 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 font-mono">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-bold tracking-widest uppercase text-zinc-500 dark:text-zinc-400">
          <span>© {new Date().getFullYear()} QUICKPOLL SYS // V1.0.0</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            SYS_OPERATIONAL
          </span>
        </div>
      </footer>
    </div>
  );
};
