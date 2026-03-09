import type { Request, Response } from 'express';

import {
  getCustomerThread,
  getThreadByIdForModeration,
  listThreadsForModeration,
  sendCustomerMessage,
  sendModeratorMessage
} from '../services/chat.service.js';

export const getMyChatThreadController = async (req: Request, res: Response) => {
  const thread = await getCustomerThread(req.auth!.userId);

  return res.status(200).json({
    data: thread
  });
};

export const postMyChatMessageController = async (req: Request, res: Response) => {
  const thread = await sendCustomerMessage(req.auth!.userId, req.auth!.role, req.body?.text ?? '');

  return res.status(201).json({
    data: thread
  });
};

export const listChatThreadsController = async (req: Request, res: Response) => {
  const threads = await listThreadsForModeration(req.auth!.role);

  return res.status(200).json({
    data: threads
  });
};

export const getChatThreadByIdController = async (req: Request, res: Response) => {
  const thread = await getThreadByIdForModeration(req.auth!.role, req.params.threadId);

  return res.status(200).json({
    data: thread
  });
};

export const postModeratorMessageController = async (req: Request, res: Response) => {
  const thread = await sendModeratorMessage(
    req.auth!.role,
    req.auth!.userId,
    req.params.threadId,
    req.body?.text ?? ''
  );

  return res.status(201).json({
    data: thread
  });
};
