import { Types } from 'mongoose';

import { ChatThreadModel } from '../models/chat-thread.model.js';
import { UserModel } from '../models/user.model.js';
import { USER_ROLES, type UserRole } from '../types/user-role.js';
import { emitChatThreadUpdated } from '../sockets/chat.socket.js';

export class ChatError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.name = 'ChatError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

type ChatMessageView = {
  id: string;
  senderRole: 'customer' | 'moderator' | 'system';
  text: string;
  createdAt: string;
};

const WORK_START_HOUR = 9;
const WORK_END_HOUR = 18;

const toMessageView = (message: {
  _id?: Types.ObjectId;
  senderRole: 'customer' | 'moderator' | 'system';
  text: string;
  createdAt: Date;
}): ChatMessageView => ({
  id: String(message._id),
  senderRole: message.senderRole,
  text: message.text,
  createdAt: message.createdAt.toISOString()
});

const toThreadView = (thread: {
  _id: Types.ObjectId;
  customerId: {
    _id?: Types.ObjectId;
    firstName?: string;
    lastName?: string;
    email?: string;
  } | Types.ObjectId;
  messages: Array<{
    _id?: Types.ObjectId;
    senderRole: 'customer' | 'moderator' | 'system';
    text: string;
    createdAt: Date;
  }>;
  lastMessageAt: Date;
  unreadForSupport?: boolean | null;
}) => {
  const customer =
    typeof thread.customerId === 'object' && 'email' in thread.customerId
      ? thread.customerId
      : undefined;
  const customerName =
    customer ? `${customer.firstName ?? ''} ${customer.lastName ?? ''}`.trim() || 'Unknown customer' : 'Unknown customer';
  const lastMessage = thread.messages.at(-1);

  return {
    id: String(thread._id),
    customerId: customer && customer._id ? String(customer._id) : '',
    customerName,
    customerEmail: customer?.email ?? 'unknown',
    lastMessageAt: thread.lastMessageAt.toISOString(),
    lastMessageText: lastMessage?.text ?? '',
    unreadForSupport: Boolean(thread.unreadForSupport),
    messages: thread.messages.map(toMessageView)
  };
};

const getSystemAutoReply = (now = new Date()) => {
  const hour = now.getHours();
  const isWorkingHours = hour >= WORK_START_HOUR && hour < WORK_END_HOUR;

  return isWorkingHours
    ? 'Please wait, our support team will respond in about 15 minutes.'
    : "We don't work right now, but we'll answer you later.";
};

const assertRoleAllowed = (role: UserRole, allowed: UserRole[]) => {
  if (!allowed.includes(role)) {
    throw new ChatError('Forbidden', 403, 'FORBIDDEN');
  }
};

const assertMessageText = (text: string) => {
  if (text.trim() === '') {
    throw new ChatError('Message text is required', 400, 'VALIDATION_ERROR');
  }
};

export const getCustomerThread = async (userId: string) => {
  const thread = await ChatThreadModel.findOne({ customerId: userId })
    .populate('customerId', 'firstName lastName email')
    .lean();

  if (!thread) {
    return null;
  }

  return toThreadView(thread);
};

export const sendCustomerMessage = async (userId: string, role: UserRole, text: string) => {
  assertRoleAllowed(role, [USER_ROLES.customer]);
  assertMessageText(text);

  const customer = await UserModel.findById(userId).lean();
  if (!customer) {
    throw new ChatError('User not found', 404, 'USER_NOT_FOUND');
  }

  const now = new Date();

  const thread =
    (await ChatThreadModel.findOne({ customerId: userId })) ??
    new ChatThreadModel({
      customerId: userId,
      messages: [],
      lastMessageAt: now
    });

  const shouldSendAutoReply = thread.messages.length === 0;

  thread.messages.push({
    senderRole: 'customer',
    senderId: new Types.ObjectId(userId),
    text: text.trim(),
    createdAt: now
  });
  if (shouldSendAutoReply) {
    thread.messages.push({
      senderRole: 'system',
      text: getSystemAutoReply(now),
      createdAt: now
    });
  }
  thread.lastMessageAt = now;
  thread.unreadForSupport = true;
  await thread.save();

  const populated = await ChatThreadModel.findById(thread.id)
    .populate('customerId', 'firstName lastName email')
    .lean();

  if (!populated) {
    throw new ChatError('Chat thread not found', 404, 'CHAT_THREAD_NOT_FOUND');
  }

  const threadView = toThreadView(populated);
  emitChatThreadUpdated(threadView);
  return threadView;
};

export const listThreadsForModeration = async (role: UserRole) => {
  assertRoleAllowed(role, [USER_ROLES.moderator, USER_ROLES.admin]);

  const threads = await ChatThreadModel.find()
    .sort({ lastMessageAt: -1 })
    .populate('customerId', 'firstName lastName email')
    .lean();

  return threads.map((thread) => toThreadView(thread));
};

export const getThreadByIdForModeration = async (role: UserRole, threadId: string) => {
  assertRoleAllowed(role, [USER_ROLES.moderator, USER_ROLES.admin]);

  if (!Types.ObjectId.isValid(threadId)) {
    throw new ChatError('Invalid thread id', 400, 'VALIDATION_ERROR');
  }

  const thread = await ChatThreadModel.findById(threadId);

  if (!thread) {
    throw new ChatError('Chat thread not found', 404, 'CHAT_THREAD_NOT_FOUND');
  }

  if (thread.unreadForSupport) {
    thread.unreadForSupport = false;
    await thread.save();
  }

  const populated = await ChatThreadModel.findById(threadId)
    .populate('customerId', 'firstName lastName email')
    .lean();

  if (!populated) {
    throw new ChatError('Chat thread not found', 404, 'CHAT_THREAD_NOT_FOUND');
  }

  const threadView = toThreadView(populated);
  emitChatThreadUpdated(threadView);
  return threadView;
};

export const sendModeratorMessage = async (
  role: UserRole,
  moderatorId: string,
  threadId: string,
  text: string
) => {
  assertRoleAllowed(role, [USER_ROLES.moderator, USER_ROLES.admin]);
  assertMessageText(text);

  if (!Types.ObjectId.isValid(threadId)) {
    throw new ChatError('Invalid thread id', 400, 'VALIDATION_ERROR');
  }

  const thread = await ChatThreadModel.findById(threadId);
  if (!thread) {
    throw new ChatError('Chat thread not found', 404, 'CHAT_THREAD_NOT_FOUND');
  }

  const now = new Date();
  thread.messages.push({
    senderRole: 'moderator',
    senderId: new Types.ObjectId(moderatorId),
    text: text.trim(),
    createdAt: now
  });
  thread.lastMessageAt = now;
  thread.unreadForSupport = false;
  await thread.save();

  const populated = await ChatThreadModel.findById(thread.id)
    .populate('customerId', 'firstName lastName email')
    .lean();

  if (!populated) {
    throw new ChatError('Chat thread not found', 404, 'CHAT_THREAD_NOT_FOUND');
  }

  const threadView = toThreadView(populated);
  emitChatThreadUpdated(threadView);
  return threadView;
};
