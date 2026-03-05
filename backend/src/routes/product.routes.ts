import { Router } from 'express';

import { listProductsController } from '../controllers/product.controller.js';

export const productRouter = Router();

productRouter.get('/', listProductsController);
