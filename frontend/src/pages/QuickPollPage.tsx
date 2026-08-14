import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { PollCard } from '../components/PollCard';
import { Poll } from '../types/poll.types';
import { useAuth } from '../store/AuthContext';
import { apiClient } from '../utils/apiClient';
import { BarChart3, Loader2 } from 'lucide-react';
import socket from '../socket/socket.config';

export const QuickPollPage: React.FC = () => {
  const { user } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    socket.connect();

    const handlePollUpdated = (updatedPoll: Poll) => {
      console.log(`Real-time poll update: `, updatedPoll);

      setPolls((prevPolls) => {
        return prevPolls.map((poll) => {
          if (poll._id === updatedPoll._id) {
            return {
              ...updatedPoll,
              userVotedOptionId: poll.userVotedOptionId || updatedPoll.userVotedOptionId,
            };
          }
          return poll;
        });
      });
    };

    socket.on("poll:updated", handlePollUpdated);
    fetchPolls();

    return () => {
      socket.off("poll:updated", handlePollUpdated);
      socket.disconnect();
    };
  }, []);

  const fetchPolls = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient<{ polls: Poll[] }>('/api/polls');
      if (res.success && res.data?.polls) {
        setPolls(res.data.polls);
      } else {
        setError(res.message || 'Failed to fetch active polls.');
      }
    } catch (err) {
      console.error('Fetch polls error:', err);
      setError('Network error fetching polls.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePollVoteSuccess = (updatedPoll: Poll) => {
    setPolls((prevPolls) =>
      prevPolls.map((poll) => (poll._id === updatedPoll._id ? updatedPoll : poll))
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-10 flex-1 w-full">
        {/* Welcome Section */}
        <section className="mb-10 p-8 rounded-3xl bg-white dark:bg-gradient-to-r dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800/80 shadow-sm relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-600/10 blur-3xl rounded-full pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
              <BarChart3 className="w-4 h-4" />
              <span>PollSpace Live Dashboard</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
              Welcome, {user?.username}! 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl text-sm leading-relaxed">
              Explore active predefined polls below. Vote on options and see live percentages update instantly.
            </p>
          </div>
        </section>

        {/* Predefined Polls Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Active Predefined Polls</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                {polls.length} Available
              </span>
            </h2>
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <p className="text-sm font-medium">Loading polls...</p>
            </div>
          ) : error ? (
            <div className="p-6 bg-rose-50 border border-rose-200 dark:bg-rose-950/30 dark:border-rose-900/50 rounded-2xl text-rose-700 dark:text-rose-300 text-sm">
              ⚠️ {error}
            </div>
          ) : polls.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-3xl text-slate-500">
              No active polls found at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {polls.map((poll) => (
                <PollCard
                  key={poll._id}
                  poll={poll}
                  onVoteSuccess={handlePollVoteSuccess}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
