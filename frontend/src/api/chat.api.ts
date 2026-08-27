import { apiClient } from '../utils/apiClient';

export interface ChatMessage {
  id: string;
  user: {
    id: string;
    username: string;
  };
  content: string;
  createdAt: string;
}

export const fetchMessagesApi = (limit: number = 50) =>
  apiClient<{ messages: ChatMessage[] }>(`/api/chat/messages?limit=${limit}`);
