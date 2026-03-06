import cors from 'cors';
import express, { type Request, type RequestHandler, type Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env.js';
import { openApiSpec } from './docs/openapi.js';
import { getHealthStatus } from './health.js';
import { authRouter } from './routes/auth.routes.js';
import { cartRouter } from './routes/cart.routes.js';
import { adminRouter } from './routes/admin.routes.js';
import { orderRouter } from './routes/order.routes.js';
import { AuthError } from './services/auth.service.js';
import { CartError } from './services/cart.service.js';
import { productRouter } from './routes/product.routes.js';
import { AdminError } from './services/admin.service.js';
import { OrderError } from './services/order.service.js';
import { ProductError } from './services/product.service.js';

export const app = express();
const allowedOrigins = new Set(
  env.CORS_ORIGINS.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
);

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    }
  })
);
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/openapi.json', (_req, res) => {
  res.json(openApiSpec);
});

const swaggerServeMiddlewares = swaggerUi.serve as unknown as RequestHandler[];
const swaggerSetupMiddleware = swaggerUi.setup(openApiSpec) as unknown as RequestHandler;

app.use('/api/docs', ...swaggerServeMiddlewares, swaggerSetupMiddleware);

app.get('/api/healthcheck', (_req, res) => {
  res.json(getHealthStatus());
});

app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);
app.use('/api/admin', adminRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((error: unknown, _req: Request, res: Response) => {
  if (error instanceof AuthError) {
    return res.status(error.statusCode).json({
      error: error.message,
      code: error.code
    });
  }

  if (error instanceof ProductError) {
    return res.status(error.statusCode).json({
      error: error.message,
      code: error.code
    });
  }

  if (error instanceof CartError) {
    return res.status(error.statusCode).json({
      error: error.message,
      code: error.code,
      meta: error.meta
    });
  }

  if (error instanceof AdminError) {
    return res.status(error.statusCode).json({
      error: error.message,
      code: error.code
    });
  }

  if (error instanceof OrderError) {
    return res.status(error.statusCode).json({
      error: error.message,
      code: error.code
    });
  }

  return res.status(500).json({
    error: 'Internal server error'
  });
});
