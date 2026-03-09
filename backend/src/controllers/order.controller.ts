import type { Request, Response } from 'express';

import { ensureCustomerRole, listMyOrders, placeOrderFromCart } from '../services/order.service.js';

export const placeOrderController = async (req: Request, res: Response) => {
  await ensureCustomerRole(req.auth!.userId);
  const result = await placeOrderFromCart(req.auth!.userId, req.body);

  return res.status(201).json({
    data: result
  });
};

export const getMyOrdersController = async (req: Request, res: Response) => {
  await ensureCustomerRole(req.auth!.userId);
  const orders = await listMyOrders(req.auth!.userId);

  return res.status(200).json({
    data: orders
  });
};
