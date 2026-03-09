import { apiAuthClient } from '@src/services/api-client';
import type { ChatThread } from '@src/types/chat';

type ChatThreadResponse = {
  data: ChatThread | null;
};

type ChatThreadsResponse = {
  data: ChatThread[];
};

type PostMessageRequest = {
  text: string;
};

export const getMyChatThread = async () => {
  const response = await apiAuthClient.get<ChatThreadResponse>('/api/chat/me');
  return response.data;
};

export const postMyChatMessage = async (payload: PostMessageRequest) => {
  const response = await apiAuthClient.post<{ data: ChatThread }>('/api/chat/me/messages', payload);
  return response.data;
};

export const getModeratorChatThreads = async () => {
  const response = await apiAuthClient.get<ChatThreadsResponse>('/api/chat/threads');
  return response.data;
};

export const getModeratorChatThread = async (threadId: string) => {
  const response = await apiAuthClient.get<{ data: ChatThread }>(`/api/chat/threads/${threadId}`);
  return response.data;
};

export const postModeratorChatMessage = async (threadId: string, payload: PostMessageRequest) => {
  const response = await apiAuthClient.post<{ data: ChatThread }>(`/api/chat/threads/${threadId}/messages`, payload);
  return response.data;
};
