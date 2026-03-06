import { Router } from 'express';

import { getMyOrdersController, placeOrderController } from '../controllers/order.controller.js';
import { asyncHandler } from '../middlewares/async-handler.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

export const orderRouter = Router();

orderRouter.use(requireAuth);
orderRouter.get('/', asyncHandler(getMyOrdersController));
orderRouter.post('/', asyncHandler(placeOrderController));
