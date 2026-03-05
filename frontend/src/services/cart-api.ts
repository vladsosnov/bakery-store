import axios from 'axios';

import { getAuthSession } from './auth-session';

type CartItem = {
  productId: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  availableStock: number;
  lineTotal: number;
};

export type CartResponse = {
  data: {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
  };
};

const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
});

const getAuthHeaders = () => {
  const session = getAuthSession();

  return {
    Authorization: `Bearer ${session?.accessToken ?? ''}`
  };
};

export const fetchCart = async () => {
  const response = await apiClient.get<CartResponse>('/api/cart', {
    headers: getAuthHeaders()
  });

  return response.data;
};

export const addToCart = async (payload: { productId: string; quantity?: number }) => {
  const response = await apiClient.post<CartResponse>('/api/cart/items', payload, {
    headers: getAuthHeaders()
  });

  return response.data;
};

export const updateCartItemQuantity = async (payload: { productId: string; quantity: number }) => {
  const response = await apiClient.patch<CartResponse>(
    `/api/cart/items/${payload.productId}`,
    { quantity: payload.quantity },
    {
      headers: getAuthHeaders()
    }
  );

  return response.data;
};

export const removeCartItem = async (payload: { productId: string }) => {
  const response = await apiClient.delete<CartResponse>(`/api/cart/items/${payload.productId}`, {
    headers: getAuthHeaders()
  });

  return response.data;
};
