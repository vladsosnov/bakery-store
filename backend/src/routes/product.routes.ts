import { Router } from 'express';

import {
  createOrUpdateProductReviewController,
  listProductReviewsController,
  listProductsController,
  removeProductReviewController
} from '../controllers/product.controller.js';
import { asyncHandler } from '../middlewares/async-handler.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';
import { USER_ROLES } from '../types/user-role.js';

export const productRouter = Router();

productRouter.get('/', asyncHandler(listProductsController));
productRouter.get('/:productId/reviews', asyncHandler(listProductReviewsController));
productRouter.delete(
  '/:productId/reviews/:reviewId',
  requireAuth,
  requireRole(USER_ROLES.admin, USER_ROLES.moderator),
  asyncHandler(removeProductReviewController)
);
productRouter.post(
  '/:productId/reviews',
  requireAuth,
  requireRole(USER_ROLES.customer),
  asyncHandler(createOrUpdateProductReviewController)
);
