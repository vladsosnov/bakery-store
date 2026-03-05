import type { Request, Response } from 'express';

import { registerCustomer } from '../services/auth.service.js';

export const registerController = async (req: Request, res: Response) => {
  const auth = await registerCustomer(req.body);

  return res.status(201).json({
    data: auth
  });
};
