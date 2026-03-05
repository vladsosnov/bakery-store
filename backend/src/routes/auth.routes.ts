import { Router } from 'express';

import {
  changePasswordController,
  getMyProfileController,
  loginController,
  registerController,
  setPasswordController,
  updateMyProfileController
} from '../controllers/auth.controller.js';
import { asyncHandler } from '../middlewares/async-handler.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

export const authRouter = Router();

authRouter.post('/register', asyncHandler(registerController));
authRouter.post('/login', asyncHandler(loginController));
authRouter.post('/change-password', asyncHandler(changePasswordController));
authRouter.post('/set-password', asyncHandler(setPasswordController));
authRouter.get('/me', requireAuth, asyncHandler(getMyProfileController));
authRouter.patch('/profile', requireAuth, asyncHandler(updateMyProfileController));
