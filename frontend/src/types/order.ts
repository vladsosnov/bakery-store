export type OrderItem = {
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
