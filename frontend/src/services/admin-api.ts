import { apiAuthClient } from '@src/services/api-client';
import {
  type AdminProduct,
  type AdminOrder,
  type AdminOrderStatus,
  type AdminUser,
  type CreateAdminProductRequest,
  type CreateModeratorRequest,
  type UpdateAdminProductRequest,
  type UpdateModeratorRequest
} from '@src/types/admin';
export {
  ORDER_STATUS_OPTIONS,
  type AdminOrder,
  type AdminOrderStatus,
  type AdminProduct,
  type AdminUser,
  type CreateAdminProductRequest,
  type CreateModeratorRequest,
  type UpdateAdminProductRequest,
  type UpdateModeratorRequest
} from '@src/types/admin';

type UsersResponse = {
  data: AdminUser[];
};

type UserResponse = {
  data: AdminUser;
};

type OrdersResponse = {
  data: AdminOrder[];
};

type OrderStatusResponse = {
  data: {
    id: string;
    status: AdminOrderStatus;
    note: string;
  };
};

type ProductsResponse = {
  data: AdminProduct[];
};

type ProductResponse = {
  data: AdminProduct;
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

export const updateAdminOrderStatus = async (orderId: string, status: AdminOrderStatus, note: string) => {
  const response = await apiAuthClient.patch<OrderStatusResponse>(`/api/admin/orders/${orderId}/status`, {
    status,
    note
  });
  return response.data;
};

export const getAdminProducts = async () => {
  const response = await apiAuthClient.get<ProductsResponse>('/api/admin/products');
  return response.data;
};

export const createAdminProduct = async (payload: CreateAdminProductRequest) => {
  const response = await apiAuthClient.post<ProductResponse>('/api/admin/products', payload);
  return response.data;
};

export const updateAdminProduct = async (productId: string, payload: UpdateAdminProductRequest) => {
  const response = await apiAuthClient.patch<ProductResponse>(`/api/admin/products/${productId}`, payload);
  return response.data;
};

export const deleteAdminProduct = async (productId: string) => {
  await apiAuthClient.delete(`/api/admin/products/${productId}`);
};
