export type ChatRole = 'customer' | 'moderator' | 'system';

export type ChatMessage = {
  id: string;
  senderRole: ChatRole;
  text: string;
  createdAt: string;
};

export type ChatThread = {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  lastMessageAt: string;
  lastMessageText: string;
  unreadForSupport: boolean;
  messages: ChatMessage[];
};
