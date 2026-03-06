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
  customerName: string;
  customerPhone: string;
  status: AdminOrderStatus;
  totalItems: number;
  totalPrice: number;
  createdAt: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    lineTotal: number;
  }>;
  deliveryAddress: {
    zip: string;
    street: string;
    city: string;
  };
};

export const ORDER_STATUS_OPTIONS = ['placed', 'in progress', 'in delivery'] as const;
export type AdminOrderStatus = (typeof ORDER_STATUS_OPTIONS)[number];

type OrdersResponse = {
  data: AdminOrder[];
};

type OrderStatusResponse = {
  data: {
    id: string;
    status: AdminOrderStatus;
  };
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

export const updateAdminOrderStatus = async (orderId: string, status: AdminOrderStatus) => {
  const response = await apiAuthClient.patch<OrderStatusResponse>(`/api/admin/orders/${orderId}/status`, {
    status
  });
  return response.data;
};
