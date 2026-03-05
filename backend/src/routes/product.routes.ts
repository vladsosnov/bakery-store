import { Router } from 'express';

import { listProductsController } from '../controllers/product.controller.js';
import { asyncHandler } from '../middlewares/async-handler.js';

export const productRouter = Router();

productRouter.get('/', asyncHandler(listProductsController));
