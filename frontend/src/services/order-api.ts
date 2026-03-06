import { apiAuthClient } from './api-client';

import type { CartResponse } from './cart-api';
import type { MyOrder } from '@src/types/order';
export type { MyOrder } from '@src/types/order';

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
