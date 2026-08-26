export interface ChatMessageDto {
  id: string;
  user: {
    id: string;
    username: string;
  };
  content: string;
  createdAt: string;
}
