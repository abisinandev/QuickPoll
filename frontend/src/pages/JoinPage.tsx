import React from 'react';
import { Header } from '../components/Header';
import { JoinForm } from '../components/JoinForm';
import { ProductPreview } from '../components/ProductPreview';
import { BarChart2, MessageSquare, Zap } from 'lucide-react';

interface FeaturePillProps {
  icon: React.ReactNode;
  label: string;
}

const FeaturePill: React.FC<FeaturePillProps> = ({ icon, label }) => (
  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 text-xs font-medium">
    {icon}
    <span>{label}</span>
  </div>
);

export const JoinPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-indigo-100 dark:selection:bg-indigo-900/40">
      {/* Minimal Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 flex items-center">
        <div className="w-full max-w-6xl mx-auto px-6 py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* ─── LEFT COLUMN: Copy + Form ─── */}
            <div className="w-full lg:w-[45%] flex flex-col gap-8">
              {/* Kicker */}
              <div className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold tracking-wide">
                <Zap className="w-3.5 h-3.5" />
                Real-time polls · Live results · Group chat
              </div>

              {/* Hero Headline */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                  Your opinion,{' '}
                  <span className="text-indigo-600 dark:text-indigo-400">live.</span>
                </h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
                  Vote together, see results change instantly, and chat with everyone.
                </p>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-2">
                <FeaturePill
                  icon={<BarChart2 className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />}
                  label="Live poll results"
                />
                <FeaturePill
                  icon={<MessageSquare className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />}
                  label="Real-time chat"
                />
                <FeaturePill
                  icon={<Zap className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />}
                  label="Instant updates"
                />
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-slate-200 dark:bg-slate-800" />

              {/* Join Form Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <JoinForm />
              </div>
            </div>

            {/* ─── RIGHT COLUMN: Product Preview ─── */}
            <div className="w-full lg:w-[55%] flex items-center justify-center">
              <ProductPreview />
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-5 border-t border-slate-100 dark:border-slate-900">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 dark:text-slate-500">
          <span>© {new Date().getFullYear()} QuickPoll — Real-time polling for everyone.</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            All systems operational
          </span>
        </div>
      </footer>
    </div>
  );
};
