import { ZodError, z } from 'zod';

import { env } from '../config/env.js';
import { UserModel } from '../models/user.model.js';
import { USER_ROLES } from '../types/user-role.js';
import { signAccessToken } from '../utils/jwt.js';
import { comparePassword, hashPassword } from '../utils/password.js';

const registerSchema = z.object({
  firstName: z.string().trim().min(1, 'firstName is required'),
  lastName: z.string().trim().min(1, 'lastName is required'),
  email: z.string().trim().email('email must be valid'),
  password: z
    .string()
    .min(8, 'password must be at least 8 characters')
    .max(128, 'password must be at most 128 characters')
});

const loginSchema = z.object({
  email: z.string().trim().email('email must be valid'),
  password: z.string().min(1, 'password is required')
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export class AuthError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export const parseRegisterInput = (payload: unknown): RegisterInput => {
  try {
    return registerSchema.parse(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AuthError(error.issues[0]?.message ?? 'Invalid request body', 400, 'VALIDATION_ERROR');
    }

    throw error;
  }
};

export const parseLoginInput = (payload: unknown): LoginInput => {
  try {
    return loginSchema.parse(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AuthError(error.issues[0]?.message ?? 'Invalid request body', 400, 'VALIDATION_ERROR');
    }

    throw error;
  }
};

const buildAuthPayload = (user: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'customer' | 'moderator' | 'admin';
}) => {
  const accessToken = signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role
  });

  return {
    user,
    accessToken
  };
};

export const registerCustomer = async (payload: unknown) => {
  const data = parseRegisterInput(payload);
  const normalizedEmail = data.email.toLowerCase();

  const existingUser = await UserModel.findOne({ email: normalizedEmail }).lean();
  if (existingUser) {
    throw new AuthError('Email is already registered', 409, 'EMAIL_TAKEN');
  }

  const passwordHash = await hashPassword(data.password);

  const user = await UserModel.create({
    firstName: data.firstName,
    lastName: data.lastName,
    email: normalizedEmail,
    passwordHash,
    role: USER_ROLES.customer
  });

  const userPublic = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role
  };

  return buildAuthPayload(userPublic);
};

export const loginUser = async (payload: unknown) => {
  const data = parseLoginInput(payload);
  const normalizedEmail = data.email.toLowerCase();

  const user = await UserModel.findOne({ email: normalizedEmail });
  if (!user) {
    throw new AuthError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  const isPasswordValid = await comparePassword(data.password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AuthError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  return buildAuthPayload({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role
  });
};

export const seedAdminUser = async () => {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    return;
  }

  const normalizedEmail = env.ADMIN_EMAIL.toLowerCase();
  const existingAdmin = await UserModel.findOne({ role: USER_ROLES.admin }).lean();

  if (existingAdmin) {
    return;
  }

  const passwordHash = await hashPassword(env.ADMIN_PASSWORD);

  await UserModel.create({
    firstName: env.ADMIN_FIRST_NAME,
    lastName: env.ADMIN_LAST_NAME,
    email: normalizedEmail,
    passwordHash,
    role: USER_ROLES.admin
  });
};
