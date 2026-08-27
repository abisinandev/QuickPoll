import { apiClient } from '../utils/apiClient';
import { User } from '../types/user.types';

export const checkSessionApi = () =>
  apiClient<{ user: User | null }>('/api/users/me');

export const joinUserApi = (username: string) =>
  apiClient<{ user: User }>('/api/users/join', {
    method: 'POST',
    data: { username },
  });

export const leaveUserApi = () =>
  apiClient<{ user: null }>('/api/users/leave', {
    method: 'POST',
  });
