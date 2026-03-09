import { Router } from 'express';

import {
  getChatThreadByIdController,
  getMyChatThreadController,
  listChatThreadsController,
  postModeratorMessageController,
  postMyChatMessageController
} from '../controllers/chat.controller.js';
import { asyncHandler } from '../middlewares/async-handler.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';
import { USER_ROLES } from '../types/user-role.js';

export const chatRouter = Router();

chatRouter.use(requireAuth);

chatRouter.get('/me', requireRole(USER_ROLES.customer), asyncHandler(getMyChatThreadController));
chatRouter.post('/me/messages', requireRole(USER_ROLES.customer), asyncHandler(postMyChatMessageController));

chatRouter.get(
  '/threads',
  requireRole(USER_ROLES.moderator, USER_ROLES.admin),
  asyncHandler(listChatThreadsController)
);
chatRouter.get(
  '/threads/:threadId',
  requireRole(USER_ROLES.moderator, USER_ROLES.admin),
  asyncHandler(getChatThreadByIdController)
);
chatRouter.post(
  '/threads/:threadId/messages',
  requireRole(USER_ROLES.moderator, USER_ROLES.admin),
  asyncHandler(postModeratorMessageController)
);
