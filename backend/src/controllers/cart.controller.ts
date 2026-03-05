import type { Request, Response } from 'express';

import {
  addItemToCart,
  getCart,
  removeCartItem,
  updateCartItemQuantity
} from '../services/cart.service.js';

export const getCartController = async (req: Request, res: Response) => {
  const cart = await getCart(req.auth!.userId);

  return res.status(200).json({
    data: cart
  });
};

export const addCartItemController = async (req: Request, res: Response) => {
  const cart = await addItemToCart(req.auth!.userId, req.body);

  return res.status(200).json({
    data: cart
  });
};

export const updateCartItemQuantityController = async (req: Request, res: Response) => {
  const cart = await updateCartItemQuantity(req.auth!.userId, req.params.productId, req.body);

  return res.status(200).json({
    data: cart
  });
};

export const removeCartItemController = async (req: Request, res: Response) => {
  const cart = await removeCartItem(req.auth!.userId, req.params.productId);

  return res.status(200).json({
    data: cart
  });
};
