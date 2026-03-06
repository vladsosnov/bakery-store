import { apiAuthClient } from '@src/services/api-client';
import type { UserRole } from '@src/types/user-role';

export type AdminUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
};

type UsersResponse = {
  data: AdminUser[];
};

type UserResponse = {
  data: AdminUser;
};

export type CreateModeratorRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type UpdateModeratorRequest = {
  firstName?: string;
  lastName?: string;
  email?: string;
  isActive?: boolean;
};

export type AdminOrder = {
  id: string;
  customerEmail: string;
  status: string;
  totalPrice: number;
  createdAt: string;
};

type OrdersResponse = {
  data: AdminOrder[];
};

export const getAdminUsers = async () => {
  const response = await apiAuthClient.get<UsersResponse>('/api/admin/users');
  return response.data;
};

export const createAdminModerator = async (payload: CreateModeratorRequest) => {
  const response = await apiAuthClient.post<UserResponse>('/api/admin/moderators', payload);
  return response.data;
};

export const updateAdminModerator = async (userId: string, payload: UpdateModeratorRequest) => {
  const response = await apiAuthClient.patch<UserResponse>(`/api/admin/moderators/${userId}`, payload);
  return response.data;
};

export const deleteAdminModerator = async (userId: string) => {
  await apiAuthClient.delete(`/api/admin/moderators/${userId}`);
};

export const getAdminOrders = async () => {
  const response = await apiAuthClient.get<OrdersResponse>('/api/admin/orders');
  return response.data;
};
