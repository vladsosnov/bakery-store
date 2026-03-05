import type { Request, Response } from 'express';

import { listProducts } from '../services/product.service.js';

export const listProductsController = async (req: Request, res: Response) => {
  const products = await listProducts(req.query);

  return res.status(200).json({
    data: products
  });
};
