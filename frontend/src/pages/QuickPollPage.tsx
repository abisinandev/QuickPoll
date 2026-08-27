import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { PollCard } from '../components/PollCard';
import { GroupChat } from '../components/GroupChat';
import { Poll } from '../types/poll.types';
import { useAuth } from '../store/AuthContext';
import { fetchPollsApi } from '../api/poll.api';
import { Terminal, Loader2 } from 'lucide-react';
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
      const res = await fetchPollsApi();
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
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col font-mono selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-10 flex-1 w-full flex flex-col xl:flex-row gap-8">
        {/* Left Side: Polls */}
        <div className="flex-1 min-w-0">
          {/* Welcome Section */}
          <section className="mb-10 p-8 border-2 border-zinc-900 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 text-[10px] font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest mb-3 bg-zinc-200 dark:bg-zinc-800 px-2 py-1">
              <Terminal className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>SYS_DASHBOARD // ACTIVE</span>
            </div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase mb-2">
              WELCOME, {user?.username} //
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-xl text-xs uppercase tracking-widest leading-relaxed">
              Observe active polling nodes. Transmit votes. Sync in real-time.
            </p>
          </div>
        </section>

        {/* Predefined Polls Grid */}
        <section>
          <div className="flex items-center justify-between mb-6 border-b-2 border-zinc-900 dark:border-zinc-800 pb-2">
            <h2 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
              <span>POLLING_NODES</span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-zinc-900 text-white dark:bg-white dark:text-black">
                {polls.length} ONLINE
              </span>
            </h2>
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-zinc-400 flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
              <p className="text-[10px] uppercase font-bold tracking-widest">CONNECTING TO NODES...</p>
            </div>
          ) : error ? (
            <div className="p-6 border-2 border-red-600 bg-red-600/10 text-red-600 font-bold uppercase text-[10px] tracking-widest">
              ERROR: {error}
            </div>
          ) : polls.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-zinc-300 dark:border-zinc-800 text-zinc-500 font-bold text-[10px] uppercase tracking-widest">
              NO ACTIVE NODES DETECTED.
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
        </div>

        {/* Right Side: Group Chat */}
        <div className="xl:w-[400px] shrink-0 h-[800px]">
          <GroupChat />
        </div>
      </main>
    </div>
  );
};
