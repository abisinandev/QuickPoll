import React, { useState } from 'react';
import { Poll } from '../types/poll.types';
import { CheckCircle, CheckCircle2, Loader2, Vote as VoteIcon } from 'lucide-react';
import { apiClient } from '../utils/apiClient';

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
    if (hasVoted || isSubmitting) return;

    setSelectedOptionId(optionId);
    setVoteError(null);
    setIsSubmitting(true);

    try {
      const res = await apiClient<{ poll: Poll }>(`/api/polls/${poll._id}/vote`, {
        method: 'POST',
        body: JSON.stringify({ optionId }),
      });

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
    }
  };

  return (
    <div className="bg-white border border-slate-200 dark:bg-slate-900/60 dark:border-slate-800/80 rounded-2xl p-6 transition-all shadow-sm hover:shadow-md flex flex-col justify-between">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
            <CheckCircle className="w-3 h-3" />
            <span>Active</span>
          </span>
          {hasVoted && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
              <CheckCircle2 className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
              <span>Voted</span>
            </span>
          )}
        </div>

        {/* Question */}
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 leading-snug">
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
              // Results Mode (After Voting)
              return (
                <div
                  key={option._id}
                  className={`relative p-3.5 rounded-xl border transition-all overflow-hidden ${
                    isUserChoice
                      ? 'bg-indigo-50/50 border-indigo-300 dark:bg-indigo-950/40 dark:border-indigo-700'
                      : 'bg-slate-50 border-slate-200 dark:bg-slate-950/60 dark:border-slate-800/60'
                  }`}
                >
                  {/* Animated Background Progress Fill */}
                  <div
                    className={`absolute inset-y-0 left-0 transition-all duration-700 ease-out opacity-20 ${
                      isUserChoice ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-slate-400 dark:bg-slate-600'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />

                  <div className="relative z-10 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${isUserChoice ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-800 dark:text-slate-200'}`}>
                        {option.text}
                      </span>
                      {isUserChoice && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-600 text-white shadow-xs">
                          Your Vote
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <span className="text-slate-500 dark:text-slate-400">({votesCount})</span>
                      <span className={isUserChoice ? 'text-indigo-700 dark:text-indigo-300 font-bold' : 'text-slate-700 dark:text-slate-300'}>
                        {percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            }

            // Voting Mode (Before Voting)
            return (
              <button
                key={option._id}
                type="button"
                onClick={() => handleVote(option._id)}
                disabled={isSubmitting}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left text-sm transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 dark:border-indigo-500 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:border-indigo-300 hover:bg-slate-100/80 dark:bg-slate-950/60 dark:border-slate-800/60 dark:hover:border-slate-700'
                }`}
              >
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {option.text}
                </span>

                {isSubmitting && isSelected ? (
                  <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                ) : (
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Vote
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {voteError && (
          <p className="mb-3 text-xs text-rose-600 dark:text-rose-400 font-medium">
            ⚠️ {voteError}
          </p>
        )}
      </div>

      {/* Footer Meta */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{poll.options.length} options</span>
        <span className="font-medium flex items-center gap-1">
          <VoteIcon className="w-3.5 h-3.5 text-indigo-500" />
          <span>{poll.totalVotes ?? 0} total votes</span>
        </span>
      </div>
    </div>
  );
};
