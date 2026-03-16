import { Router } from 'express';

import { createOrUpdateProductReviewController, listProductsController } from '../controllers/product.controller.js';
import { asyncHandler } from '../middlewares/async-handler.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';
import { USER_ROLES } from '../types/user-role.js';

export const productRouter = Router();

productRouter.get('/', asyncHandler(listProductsController));
productRouter.post(
  '/:productId/reviews',
  requireAuth,
  requireRole(USER_ROLES.customer),
  asyncHandler(createOrUpdateProductReviewController)
);
