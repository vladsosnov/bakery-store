import { Router } from 'express';

import {
  changePasswordController,
  loginController,
  registerController,
  setPasswordController
} from '../controllers/auth.controller.js';

export const authRouter = Router();

authRouter.post('/register', registerController);
authRouter.post('/login', loginController);
authRouter.post('/change-password', changePasswordController);
authRouter.post('/set-password', setPasswordController);
