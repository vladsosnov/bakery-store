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

export type AdminProduct = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  tags: string[];
  isAvailable: boolean;
  stock: number;
};

export type CreateAdminProductRequest = {
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  tags: string[];
  isAvailable: boolean;
  stock: number;
};

export type UpdateAdminProductRequest = Partial<CreateAdminProductRequest> & {
  slug?: string;
};

export const ORDER_STATUS_OPTIONS = ['placed', 'in progress', 'in delivery', 'canceled'] as const;
export type AdminOrderStatus = (typeof ORDER_STATUS_OPTIONS)[number];

export type AdminOrder = {
  id: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  status: AdminOrderStatus;
  note: string;
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
