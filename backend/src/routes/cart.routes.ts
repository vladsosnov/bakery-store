import { Router } from 'express';

import {
  addCartItemController,
  getCartController,
  removeCartItemController,
  updateCartItemQuantityController
} from '../controllers/cart.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

export const cartRouter = Router();

cartRouter.use(requireAuth);
cartRouter.get('/', getCartController);
cartRouter.post('/items', addCartItemController);
cartRouter.patch('/items/:productId', updateCartItemQuantityController);
cartRouter.delete('/items/:productId', removeCartItemController);
