import type { Request, Response } from 'express';

import {
  createModerator,
  listAllOrders,
  listAllUsers,
  removeModerator,
  updateOrderStatus,
  updateModerator
} from '../services/admin.service.js';

export const getAllUsersController = async (_req: Request, res: Response) => {
  const users = await listAllUsers();

  return res.status(200).json({
    data: users
  });
};

export const createModeratorController = async (req: Request, res: Response) => {
  const moderator = await createModerator(req.body);

  return res.status(201).json({
    data: moderator
  });
};

export const updateModeratorController = async (req: Request, res: Response) => {
  const moderator = await updateModerator(req.params.userId, req.body);

  return res.status(200).json({
    data: moderator
  });
};

export const removeModeratorController = async (req: Request, res: Response) => {
  await removeModerator(req.params.userId);

  return res.status(204).send();
};

export const getAllOrdersController = async (_req: Request, res: Response) => {
  const orders = await listAllOrders();

  return res.status(200).json({
    data: orders
  });
};

export const updateOrderStatusController = async (req: Request, res: Response) => {
  const order = await updateOrderStatus(req.params.orderId, req.body);

  return res.status(200).json({
    data: order
  });
};
