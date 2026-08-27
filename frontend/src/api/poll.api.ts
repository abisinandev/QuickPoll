import { apiClient } from '../utils/apiClient';
import { Poll } from '../types/poll.types';

export const fetchPollsApi = () => 
  apiClient<{ polls: Poll[] }>(`${import.meta.env.VITE_BACKEND_URL}/api/polls`);

export const voteApi = (pollId: string, optionId: string) => 
  apiClient<{ poll: Poll }>(`${import.meta.env.VITE_BACKEND_URL}/api/polls/${pollId}/vote`, {
    method: 'POST',
    body: JSON.stringify({ optionId }),
  });
