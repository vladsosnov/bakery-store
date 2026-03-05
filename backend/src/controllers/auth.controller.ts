import type { Request, Response } from 'express';

import {
  changePasswordByEmail,
  loginUser,
  registerCustomer,
  setOwnPassword
} from '../services/auth.service.js';

export const registerController = async (req: Request, res: Response) => {
  const auth = await registerCustomer(req.body);

  return res.status(201).json({
    data: auth
  });
};

export const loginController = async (req: Request, res: Response) => {
  const auth = await loginUser(req.body);

  return res.status(200).json({
    data: auth
  });
};

export const changePasswordController = async (req: Request, res: Response) => {
  const result = await changePasswordByEmail(req.body);

  return res.status(200).json({
    data: result
  });
};

export const setPasswordController = async (req: Request, res: Response) => {
  const result = await setOwnPassword(req.body);

  return res.status(200).json({
    data: result
  });
};
