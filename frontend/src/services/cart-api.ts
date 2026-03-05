import { apiAuthClient } from './api-client';

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

export const fetchCart = async () => {
  const response = await apiAuthClient.get<CartResponse>('/api/cart');

  return response.data;
};

export const addToCart = async (payload: { productId: string; quantity?: number }) => {
  const response = await apiAuthClient.post<CartResponse>('/api/cart/items', payload);

  return response.data;
};

export const updateCartItemQuantity = async (payload: { productId: string; quantity: number }) => {
  const response = await apiAuthClient.patch<CartResponse>(
    `/api/cart/items/${payload.productId}`,
    { quantity: payload.quantity }
  );

  return response.data;
};

export const removeCartItem = async (payload: { productId: string }) => {
  const response = await apiAuthClient.delete<CartResponse>(`/api/cart/items/${payload.productId}`);

  return response.data;
};
