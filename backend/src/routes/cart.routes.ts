import { Router } from 'express';

import {
  addCartItemController,
  getCartController,
  removeCartItemController,
  updateCartItemQuantityController
} from '../controllers/cart.controller.js';
import { asyncHandler } from '../middlewares/async-handler.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

export const cartRouter = Router();

cartRouter.use(requireAuth);
cartRouter.get('/', asyncHandler(getCartController));
cartRouter.post('/items', asyncHandler(addCartItemController));
cartRouter.patch('/items/:productId', asyncHandler(updateCartItemQuantityController));
cartRouter.delete('/items/:productId', asyncHandler(removeCartItemController));
