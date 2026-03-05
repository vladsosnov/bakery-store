import 'dotenv/config';

import { z } from 'zod';

const emptyToUndefined = (value: unknown) => {
  if (typeof value === 'string' && value.trim() === '') {
    return undefined;
  }

  return value;
};

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().min(1).default('mongodb://127.0.0.1:27017/bakery-store'),
  JWT_SECRET: z.string().min(16).default('dev_jwt_secret_change_me_please'),
  ADMIN_EMAIL: z.preprocess(emptyToUndefined, z.string().email().optional()),
  ADMIN_PASSWORD: z.preprocess(emptyToUndefined, z.string().min(8).optional()),
  ADMIN_FIRST_NAME: z.string().min(1).default('Admin'),
  ADMIN_LAST_NAME: z.string().min(1).default('User')
});

export const env = envSchema.parse(process.env);
