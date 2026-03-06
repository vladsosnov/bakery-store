import { Router } from 'express';

import {
  createModeratorController,
  getAllOrdersController,
  getAllUsersController,
  removeModeratorController,
  updateModeratorController
} from '../controllers/admin.controller.js';
import { asyncHandler } from '../middlewares/async-handler.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';
import { USER_ROLES } from '../types/user-role.js';

export const adminRouter = Router();

adminRouter.use(requireAuth);

adminRouter.get('/users', requireRole(USER_ROLES.admin), asyncHandler(getAllUsersController));
adminRouter.post('/moderators', requireRole(USER_ROLES.admin), asyncHandler(createModeratorController));
adminRouter.patch('/moderators/:userId', requireRole(USER_ROLES.admin), asyncHandler(updateModeratorController));
adminRouter.delete('/moderators/:userId', requireRole(USER_ROLES.admin), asyncHandler(removeModeratorController));
adminRouter.get(
  '/orders',
  requireRole(USER_ROLES.admin, USER_ROLES.moderator),
  asyncHandler(getAllOrdersController)
);
