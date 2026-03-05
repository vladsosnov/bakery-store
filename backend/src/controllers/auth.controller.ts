import type { Request, Response } from 'express';

import { loginUser, registerCustomer } from '../services/auth.service.js';

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
