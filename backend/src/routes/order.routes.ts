import { Router } from 'express';

import { getMyOrdersController, placeOrderController } from '../controllers/order.controller.js';
import { asyncHandler } from '../middlewares/async-handler.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';
import { USER_ROLES } from '../types/user-role.js';

export const orderRouter = Router();

orderRouter.use(requireAuth);
orderRouter.use(requireRole(USER_ROLES.customer));
orderRouter.get('/', asyncHandler(getMyOrdersController));
orderRouter.post('/', asyncHandler(placeOrderController));
