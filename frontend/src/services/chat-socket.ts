import { io, type Socket } from 'socket.io-client';

import { getAuthSession } from '@src/services/auth-session';
import type { ChatThread } from '@src/types/chat';

declare const __API_BASE_URL__: string | undefined;

let socket: Socket | null = null;
let socketToken: string | null = null;

const getSocketBaseUrl = () => {
  if (typeof __API_BASE_URL__ === 'string' && __API_BASE_URL__.trim() !== '') {
    return __API_BASE_URL__;
  }

  if (window.location.hostname === 'localhost') {
    return 'http://localhost:4000';
  }

  return window.location.origin;
};

const ensureSocket = () => {
  const session = getAuthSession();
  if (!session?.accessToken) {
    return null;
  }

  if (socket && socketToken === session.accessToken) {
    return socket;
  }

  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socketToken = session.accessToken;
  socket = io(getSocketBaseUrl(), {
    transports: ['websocket'],
    auth: {
      token: session.accessToken
    }
  });

  return socket;
};

export const subscribeToChatThreadUpdates = (handler: (thread: ChatThread) => void) => {
  if (process.env.NODE_ENV === 'test') {
    return () => undefined;
  }

  const activeSocket = ensureSocket();
  if (!activeSocket) {
    return () => undefined;
  }

  activeSocket.on('chat:thread-updated', handler);

  return () => {
    activeSocket.off('chat:thread-updated', handler);
  };
};
