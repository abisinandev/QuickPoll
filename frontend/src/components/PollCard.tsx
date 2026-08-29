import React, { useState } from 'react';
import { Poll } from '../types/poll.types';
import { CheckCircle, CheckCircle2, Loader2, Vote as VoteIcon } from 'lucide-react';
import { voteApi } from '../api/poll.api';

interface PollCardProps {
  poll: Poll;
  onVoteSuccess?: (updatedPoll: Poll) => void;
}

export const PollCard: React.FC<PollCardProps> = ({ poll, onVoteSuccess }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [voteError, setVoteError] = useState<string | null>(null);

  const hasVoted = Boolean(poll.userVotedOptionId);

  const handleVote = async (optionId: string) => {
    if (isSubmitting) return;

    setSelectedOptionId(optionId);
    setVoteError(null);
    setIsSubmitting(true);

    try {
      const res = await voteApi(poll._id, optionId);

      if (res.success && res.data?.poll) {
        if (onVoteSuccess) {
          onVoteSuccess(res.data.poll);
        }
      } else {
        setVoteError(res.message || 'Failed to submit vote. Please try again.');
      }
    } catch (err) {
      console.error('Vote error:', err);
      setVoteError('Network error while voting.');
    } finally {
      setIsSubmitting(false);
      setSelectedOptionId(null);
    }
  };

  return (
    <div className="bg-transparent border-2 border-zinc-900 dark:border-zinc-800 p-6 flex flex-col justify-between font-mono">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 border-2 border-emerald-600 dark:border-emerald-400 text-emerald-700 dark:text-emerald-400">
            <CheckCircle className="w-3 h-3" />
            <span>ACTIVE</span>
          </span>
          {hasVoted && (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 bg-indigo-600 text-white dark:bg-indigo-500">
              <CheckCircle2 className="w-3 h-3" />
              <span>VOTED</span>
            </span>
          )}
        </div>

        {/* Question */}
        <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-5 leading-none">
          {poll.question}
        </h3>

        {/* Options List */}
        <div className="space-y-3 mb-4">
          {poll.options.map((option) => {
            const isUserChoice = poll.userVotedOptionId === option._id;
            const isSelected = selectedOptionId === option._id;
            const percentage = option.percentage ?? 0;
            const votesCount = option.votesCount ?? 0;

            if (hasVoted) {
              // Results Mode (After Voting) — still clickable: re-click your
              // option to unselect it, or click another to switch your vote.
              return (
                <button
                  key={option._id}
                  type="button"
                  onClick={() => handleVote(option._id)}
                  disabled={isSubmitting}
                  className={`group relative w-full p-3.5 border-2 text-left transition-all overflow-hidden cursor-pointer disabled:cursor-wait ${
                    isUserChoice
                      ? 'border-indigo-600 dark:border-indigo-400'
                      : 'border-zinc-300 dark:border-zinc-800 hover:border-indigo-600 dark:hover:border-indigo-400'
                  }`}
                >
                  {/* Animated Background Progress Fill */}
                  <div
                    className={`absolute inset-y-0 left-0 transition-all duration-700 ease-out ${
                      isUserChoice ? 'bg-indigo-600/10 dark:bg-indigo-400/10' : 'bg-zinc-200 dark:bg-zinc-900'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />

                  <div className="relative z-10 flex items-center justify-between text-xs font-bold tracking-widest uppercase">
                    <div className="flex items-center gap-2">
                      <span className={`${isUserChoice ? 'text-indigo-700 dark:text-indigo-300' : 'text-zinc-500 dark:text-zinc-400'}`}>
                        {option.text}
                      </span>
                      {isUserChoice && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-indigo-600 text-white dark:bg-indigo-500 group-hover:hidden">
                          YOUR VOTE
                        </span>
                      )}
                      {isUserChoice && !isSubmitting && (
                        <span className="hidden group-hover:inline text-[9px] px-1.5 py-0.5 bg-red-600 text-white">
                          CLICK TO UNSELECT
                        </span>
                      )}
                      {!isUserChoice && !isSubmitting && (
                        <span className="hidden group-hover:inline text-[9px] px-1.5 py-0.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                          SWITCH VOTE
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {isSubmitting && isSelected ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600 dark:text-indigo-400" />
                      ) : (
                        <span className="text-zinc-400 dark:text-zinc-600">[{votesCount}]</span>
                      )}
                      <span className={isUserChoice ? 'text-indigo-700 dark:text-indigo-300' : 'text-zinc-500 dark:text-zinc-400'}>
                        {percentage}%
                      </span>
                    </div>
                  </div>
                </button>
              );
            }

            // Voting Mode (Before Voting)
            return (
              <button
                key={option._id}
                type="button"
                onClick={() => handleVote(option._id)}
                disabled={isSubmitting}
                className={`group w-full flex items-center justify-between p-3.5 border-2 text-left text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                    : 'border-zinc-300 dark:border-zinc-800 hover:border-indigo-600 dark:hover:border-indigo-400 text-zinc-600 dark:text-zinc-400 hover:text-indigo-700 dark:hover:text-indigo-300'
                }`}
              >
                <span>
                  {option.text}
                </span>

                <div className="flex items-center gap-3">
                  <span className="transition-opacity group-hover:opacity-0 group-hover:hidden md:group-hover:block md:group-hover:opacity-100">
                    [{votesCount}]
                  </span>
                  {isSubmitting && isSelected ? (
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
                  ) : (
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 md:relative md:right-0">
                      // VOTE
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {voteError && (
          <p className="mb-3 text-[10px] uppercase font-bold tracking-widest text-white bg-red-600 px-2 py-1 inline-block">
            ERROR: {voteError}
          </p>
        )}
      </div>

      {/* Footer Meta */}
      <div className="pt-4 mt-2 border-t-2 border-zinc-900 dark:border-zinc-800 flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-zinc-500 dark:text-zinc-400">
        <span>[{poll.options.length} OPTIONS]</span>
        <span className="flex items-center gap-2">
          <VoteIcon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>{poll.totalVotes ?? 0} TOTAL</span>
        </span>
      </div>
    </div>
  );
};
