import { useEffect, useState } from 'react';
import { Vote, CheckCircle, Server } from 'lucide-react';

export default function App() {
  const [apiStatus, setApiStatus] = useState<string>('Checking backend...');

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setApiStatus(data.message))
      .catch(() => setApiStatus('Backend offline or unreachable'));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
          <Vote className="w-8 h-8" />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            QuickPoll
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            React + Vite + TypeScript + Tailwind CSS Setup
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3 text-left">
          <Server className="w-5 h-5 text-indigo-400 shrink-0" />
          <div className="text-xs">
            <span className="block font-semibold text-slate-300">API Status</span>
            <span className="text-slate-400">{apiStatus}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 py-2.5 px-4 rounded-lg">
          <CheckCircle className="w-4 h-4" />
          <span>Tailwind CSS & TypeScript Active</span>
        </div>
      </div>
    </div>
  );
}
