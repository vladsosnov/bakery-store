import { Types } from 'mongoose';
import { ZodError, z } from 'zod';

import { CartModel } from '../models/cart.model.js';
import { OrderModel } from '../models/order.model.js';
import { ProductModel } from '../models/product.model.js';
import { ORDER_STATUS_VALUES, ORDER_STATUSES, type OrderStatus } from '../types/order-status.js';
import { UserModel } from '../models/user.model.js';

export class OrderError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.name = 'OrderError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUS_VALUES as [OrderStatus, ...OrderStatus[]])
});

const buildOrderView = (order: {
  id?: string;
  _id?: Types.ObjectId;
  status: string;
  totalItems: number;
  totalPrice: number;
  createdAt?: Date;
  items: Array<{
    productId: Types.ObjectId | string;
    name: string;
    price: number;
    quantity: number;
    lineTotal: number;
  }>;
}) => ({
  id: order.id ?? String(order._id),
  status: order.status,
  totalItems: order.totalItems,
  totalPrice: order.totalPrice,
  createdAt: order.createdAt?.toISOString() ?? null,
  items: order.items.map((item) => ({
    productId: String(item.productId),
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    lineTotal: item.lineTotal
  }))
});

export const placeOrderFromCart = async (userId: string) => {
  const cart = await CartModel.findOne({ userId });
  if (!cart || cart.items.length === 0) {
    throw new OrderError('Cart is empty', 400, 'EMPTY_CART');
  }

  const productIds = cart.items.map((item) => item.productId);
  const products = await ProductModel.find({ _id: { $in: productIds } });
  const productById = new Map(products.map((product) => [String(product._id), product]));

  for (const item of cart.items) {
    const product = productById.get(String(item.productId));
    if (!product || !product.isAvailable) {
      throw new OrderError('One or more products are unavailable', 409, 'PRODUCT_UNAVAILABLE');
    }

    if (item.quantity > product.stock) {
      throw new OrderError('Not enough stock available', 409, 'OUT_OF_STOCK');
    }
  }

  const orderItems = cart.items.map((item) => {
    const product = productById.get(String(item.productId))!;
    const lineTotal = Number((product.price * item.quantity).toFixed(2));

    return {
      productId: item.productId,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      lineTotal
    };
  });

  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = Number(orderItems.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2));

  for (const item of cart.items) {
    const product = productById.get(String(item.productId))!;
    product.stock = product.stock - item.quantity;
    if (product.stock <= 0) {
      product.stock = 0;
      product.isAvailable = false;
    }
    await product.save();
  }

  const order = await OrderModel.create({
    userId,
    status: ORDER_STATUSES.placed,
    items: orderItems,
    totalItems,
    totalPrice
  });

  cart.items.splice(0, cart.items.length);
  await cart.save();

  return {
    order: buildOrderView(order),
    cart: {
      items: [],
      totalItems: 0,
      totalPrice: 0
    }
  };
};

export const listMyOrders = async (userId: string) => {
  const orders = await OrderModel.find({ userId }).sort({ createdAt: -1 }).lean();
  return orders.map((order) => buildOrderView(order));
};

export const listAllOrdersForDashboard = async () => {
  const orders = await OrderModel.find()
    .sort({ createdAt: -1 })
    .populate('userId', 'email firstName lastName phoneNumber address')
    .lean();

  return orders.map((order) => {
    const user = order.userId as
      | {
          email?: string;
          firstName?: string;
          lastName?: string;
          phoneNumber?: string;
          address?: {
            zip?: string;
            street?: string;
            city?: string;
          };
        }
      | Types.ObjectId
      | null;
    const isUserPopulated = typeof user === 'object' && user !== null && 'email' in user;
    const customerEmail = isUserPopulated ? user.email ?? 'unknown' : 'unknown';
    const customerName = isUserPopulated
      ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'Unknown customer'
      : 'Unknown customer';
    const customerPhone = isUserPopulated ? user.phoneNumber ?? '' : '';
    const address = isUserPopulated ? user.address : undefined;

    return {
      id: String(order._id),
      customerEmail,
      customerName,
      customerPhone,
      status: order.status,
      totalItems: order.totalItems,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt?.toISOString() ?? new Date().toISOString(),
      items: order.items.map((item) => ({
        productId: String(item.productId),
        name: item.name,
        quantity: item.quantity,
        lineTotal: item.lineTotal
      })),
      deliveryAddress: {
        zip: address?.zip ?? '',
        street: address?.street ?? '',
        city: address?.city ?? ''
      }
    };
  });
};

export const updateOrderStatusForDashboard = async (orderId: string, payload: unknown) => {
  if (!Types.ObjectId.isValid(orderId)) {
    throw new OrderError('Invalid order id', 400, 'VALIDATION_ERROR');
  }

  let data: { status: OrderStatus };

  try {
    data = updateOrderStatusSchema.parse(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new OrderError(error.issues[0]?.message ?? 'Invalid request body', 400, 'VALIDATION_ERROR');
    }

    throw error;
  }

  const order = await OrderModel.findById(orderId);
  if (!order) {
    throw new OrderError('Order not found', 404, 'ORDER_NOT_FOUND');
  }

  order.status = data.status;
  await order.save();

  return {
    id: order.id,
    status: order.status
  };
};

export const ensureCustomerRole = async (userId: string) => {
  const user = await UserModel.findById(userId).lean();
  if (!user) {
    throw new OrderError('User not found', 404, 'USER_NOT_FOUND');
  }

  if (user.role !== 'customer') {
    throw new OrderError('Only customers can place orders', 403, 'FORBIDDEN');
  }
};
