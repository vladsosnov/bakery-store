import type { Request, Response } from 'express';

import { createOrUpdateProductReview, listProducts } from '../services/product.service.js';

export const listProductsController = async (req: Request, res: Response) => {
  const products = await listProducts(req.query);

  return res.status(200).json({
    data: products
  });
};

export const createOrUpdateProductReviewController = async (req: Request, res: Response) => {
  const result = await createOrUpdateProductReview(req.params.productId, req.auth!.userId, req.body);

  return res.status(200).json({
    data: result
  });
};
