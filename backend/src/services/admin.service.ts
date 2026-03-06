import { ZodError, z } from 'zod';
import { Types } from 'mongoose';

import { UserModel } from '../models/user.model.js';
import { listAllOrdersForDashboard, updateOrderStatusForDashboard } from './order.service.js';
import { USER_ROLES } from '../types/user-role.js';
import { hashPassword } from '../utils/password.js';

const createModeratorSchema = z.object({
  firstName: z.string().trim().min(1, 'firstName is required'),
  lastName: z.string().trim().min(1, 'lastName is required'),
  email: z.string().trim().email('email must be valid'),
  password: z
    .string()
    .min(8, 'password must be at least 8 characters')
    .max(128, 'password must be at most 128 characters')
});

const updateModeratorSchema = z
  .object({
    firstName: z.string().trim().min(1, 'firstName is required').optional(),
    lastName: z.string().trim().min(1, 'lastName is required').optional(),
    email: z.string().trim().email('email must be valid').optional(),
    isActive: z.boolean().optional()
  })
  .refine(
    (payload) =>
      payload.firstName !== undefined ||
      payload.lastName !== undefined ||
      payload.email !== undefined ||
      payload.isActive !== undefined,
    {
      message: 'At least one field is required'
    }
  );

export type CreateModeratorInput = z.infer<typeof createModeratorSchema>;
export type UpdateModeratorInput = z.infer<typeof updateModeratorSchema>;

export class AdminError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.name = 'AdminError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export const parseCreateModeratorInput = (payload: unknown): CreateModeratorInput => {
  try {
    return createModeratorSchema.parse(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AdminError(error.issues[0]?.message ?? 'Invalid request body', 400, 'VALIDATION_ERROR');
    }

    throw error;
  }
};

export const parseUpdateModeratorInput = (payload: unknown): UpdateModeratorInput => {
  try {
    return updateModeratorSchema.parse(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AdminError(error.issues[0]?.message ?? 'Invalid request body', 400, 'VALIDATION_ERROR');
    }

    throw error;
  }
};

const toAdminUserView = (user: {
  id?: string;
  _id?: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}) => ({
  id: user.id ?? String(user._id),
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt?.toISOString() ?? null,
  updatedAt: user.updatedAt?.toISOString() ?? null
});

export const listAllUsers = async () => {
  const users = await UserModel.find()
    .select('firstName lastName email role isActive createdAt updatedAt')
    .sort({ createdAt: -1 });

  return users.map((user) => toAdminUserView(user));
};

export const createModerator = async (payload: unknown) => {
  const data = parseCreateModeratorInput(payload);
  const normalizedEmail = data.email.toLowerCase();
  const existingUser = await UserModel.findOne({ email: normalizedEmail }).lean();

  if (existingUser) {
    throw new AdminError('Email is already registered', 409, 'EMAIL_TAKEN');
  }

  const passwordHash = await hashPassword(data.password);
  const user = await UserModel.create({
    firstName: data.firstName,
    lastName: data.lastName,
    email: normalizedEmail,
    passwordHash,
    role: USER_ROLES.moderator
  });

  return toAdminUserView(user);
};

export const updateModerator = async (userId: string, payload: unknown) => {
  const data = parseUpdateModeratorInput(payload);
  const moderator = await UserModel.findById(userId);

  if (!moderator || moderator.role !== USER_ROLES.moderator) {
    throw new AdminError('Moderator not found', 404, 'MODERATOR_NOT_FOUND');
  }

  if (data.email) {
    const normalizedEmail = data.email.toLowerCase();
    const existingUser = await UserModel.findOne({ email: normalizedEmail }).lean();
    if (existingUser && String(existingUser._id) !== moderator.id) {
      throw new AdminError('Email is already registered', 409, 'EMAIL_TAKEN');
    }
    moderator.email = normalizedEmail;
  }

  if (data.firstName !== undefined) {
    moderator.firstName = data.firstName;
  }

  if (data.lastName !== undefined) {
    moderator.lastName = data.lastName;
  }

  if (data.isActive !== undefined) {
    moderator.isActive = data.isActive;
  }

  await moderator.save();
  return toAdminUserView(moderator);
};

export const removeModerator = async (userId: string) => {
  const moderator = await UserModel.findById(userId);

  if (!moderator || moderator.role !== USER_ROLES.moderator) {
    throw new AdminError('Moderator not found', 404, 'MODERATOR_NOT_FOUND');
  }

  await moderator.deleteOne();
};

export const listAllOrders = async () => {
  return listAllOrdersForDashboard();
};

export const updateOrderStatus = async (orderId: string, payload: unknown) => {
  return updateOrderStatusForDashboard(orderId, payload);
};
