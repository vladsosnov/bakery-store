import { Router } from 'express';

import {
  addCartItemController,
  getCartController,
  removeCartItemController,
  updateCartItemQuantityController
} from '../controllers/cart.controller.js';
import { asyncHandler } from '../middlewares/async-handler.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';
import { USER_ROLES } from '../types/user-role.js';

export const cartRouter = Router();

cartRouter.use(requireAuth);
cartRouter.use(requireRole(USER_ROLES.customer));
cartRouter.get('/', asyncHandler(getCartController));
cartRouter.post('/items', asyncHandler(addCartItemController));
cartRouter.patch('/items/:productId', asyncHandler(updateCartItemQuantityController));
cartRouter.delete('/items/:productId', asyncHandler(removeCartItemController));
