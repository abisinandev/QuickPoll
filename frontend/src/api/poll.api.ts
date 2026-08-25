import { apiClient } from '../utils/apiClient';
import { Poll } from '../types/poll.types';

export const fetchPollsApi = () => 
  apiClient<{ polls: Poll[] }>('/api/polls');

export const voteApi = (pollId: string, optionId: string) => 
  apiClient<{ poll: Poll }>(`/api/polls/${pollId}/vote`, {
    method: 'POST',
    body: JSON.stringify({ optionId }),
  });
