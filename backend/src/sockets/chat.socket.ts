import { Server, type Server as HttpServerType } from 'http';
import { Server as SocketServer, type Socket } from 'socket.io';

import { verifyAccessToken } from '../utils/jwt.js';
import { USER_ROLES } from '../types/user-role.js';

type ChatThreadSocketPayload = {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  lastMessageAt: string;
  lastMessageText: string;
  messages: Array<{
    id: string;
    senderRole: 'customer' | 'moderator' | 'system';
    text: string;
    createdAt: string;
  }>;
};

type AuthSocketData = {
  userId: string;
  role: string;
};

let io: SocketServer | null = null;

const getTokenFromSocket = (socket: Socket) => {
  const authToken = socket.handshake.auth?.token;
  if (typeof authToken === 'string' && authToken.trim() !== '') {
    return authToken;
  }

  const authHeader = socket.handshake.headers.authorization;
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return authHeader.slice('Bearer '.length).trim();
  }

  return null;
};

export const initChatSocketServer = (httpServer: HttpServerType) => {
  io = new SocketServer(httpServer, {
    cors: {
      origin: true,
      credentials: true
    }
  });

  io.use((socket, next) => {
    const token = getTokenFromSocket(socket);
    if (!token) {
      next(new Error('UNAUTHORIZED'));
      return;
    }

    try {
      const payload = verifyAccessToken(token);
      socket.data.auth = {
        userId: payload.sub,
        role: payload.role
      } satisfies AuthSocketData;
      next();
    } catch {
      next(new Error('UNAUTHORIZED'));
    }
  });

  io.on('connection', (socket) => {
    const auth = socket.data.auth as AuthSocketData | undefined;
    if (!auth) {
      return;
    }

    socket.join(`user:${auth.userId}`);

    if (auth.role === USER_ROLES.moderator || auth.role === USER_ROLES.admin) {
      socket.join('support:team');
    }
  });

  return io;
};

export const emitChatThreadUpdated = (thread: ChatThreadSocketPayload) => {
  if (!io) {
    return;
  }

  if (thread.customerId) {
    io.to(`user:${thread.customerId}`).emit('chat:thread-updated', thread);
  }

  io.to('support:team').emit('chat:thread-updated', thread);
};
