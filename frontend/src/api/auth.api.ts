import { apiClient } from '../utils/apiClient';
import { User } from '../types/user.types';

export const checkSessionApi = () =>
  apiClient<{ user: User | null }>('/api/users/me');

export const joinUserApi = (username: string) =>
  apiClient<{ user: User }>(`${import.meta.env.VITE_BACKEND_URL}/api/users/join`, {
    method: 'POST',
    body: JSON.stringify({ username }),
  });
