import { apiAuthClient } from './api-client';

import type { CartResponse } from './cart-api';

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
};

export type MyOrder = {
  id: string;
  status: string;
  totalItems: number;
  totalPrice: number;
  createdAt: string | null;
  items: OrderItem[];
};

type PlaceOrderResponse = {
  data: {
    order: MyOrder;
    cart: CartResponse['data'];
  };
};

type MyOrdersResponse = {
  data: MyOrder[];
};

export const placeOrder = async () => {
  const response = await apiAuthClient.post<PlaceOrderResponse>('/api/orders');
  return response.data;
};

export const getMyOrders = async () => {
  const response = await apiAuthClient.get<MyOrdersResponse>('/api/orders');
  return response.data;
};
