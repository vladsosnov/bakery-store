import { Types } from 'mongoose';
import { ZodError, z } from 'zod';

import { CartModel } from '../models/cart.model.js';
import { ORDER_NOTE_MAX_LENGTH } from '../constants/validation.js';
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
  status: z.enum(ORDER_STATUS_VALUES as [OrderStatus, ...OrderStatus[]]),
  note: z.string().trim().max(ORDER_NOTE_MAX_LENGTH).optional()
});
const orderDeliveryAddressSchema = z.object({
  zip: z.string().trim().min(1),
  street: z.string().trim().min(1),
  city: z.string().trim().min(1)
});
const placeOrderSchema = z.object({
  useProfileAddress: z.boolean().default(true),
  deliveryAddress: orderDeliveryAddressSchema.optional(),
  note: z.string().trim().max(ORDER_NOTE_MAX_LENGTH).optional()
});
const isAddressIncomplete = (address: { zip: string; street: string; city: string }) => {
  return address.zip.trim() === '' || address.street.trim() === '' || address.city.trim() === '';
};

const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [ORDER_STATUSES.placed]: [ORDER_STATUSES.placed, ORDER_STATUSES.inProgress, ORDER_STATUSES.canceled],
  [ORDER_STATUSES.inProgress]: [ORDER_STATUSES.inProgress, ORDER_STATUSES.inDelivery, ORDER_STATUSES.canceled],
  [ORDER_STATUSES.inDelivery]: [ORDER_STATUSES.inDelivery, ORDER_STATUSES.delivered],
  [ORDER_STATUSES.delivered]: [ORDER_STATUSES.delivered],
  [ORDER_STATUSES.canceled]: [ORDER_STATUSES.canceled]
};

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
    review?: {
      rating: number;
      comment: string;
      updatedAt: string | null;
    } | null;
  }>;
  deliveryAddress?: {
    zip: string;
    street: string;
    city: string;
  } | null;
  note?: string | null;
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
    lineTotal: item.lineTotal,
    review: item.review ?? null
  })),
  note: order.note ?? '',
  deliveryAddress: {
    zip: order.deliveryAddress?.zip ?? '',
    street: order.deliveryAddress?.street ?? '',
    city: order.deliveryAddress?.city ?? ''
  }
});

export const placeOrderFromCart = async (userId: string, payload: unknown = { useProfileAddress: true }) => {
  let data: {
    useProfileAddress: boolean;
    deliveryAddress?: {
      zip: string;
      street: string;
      city: string;
    };
    note?: string;
  };

  try {
    data = placeOrderSchema.parse(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new OrderError(error.issues[0]?.message ?? 'Invalid request body', 400, 'VALIDATION_ERROR');
    }

    throw error;
  }

  const cart = await CartModel.findOne({ userId });
  if (!cart || cart.items.length === 0) {
    throw new OrderError('Cart is empty', 400, 'EMPTY_CART');
  }

  let deliveryAddress = {
    zip: '',
    street: '',
    city: ''
  };

  if (data.useProfileAddress) {
    const user = await UserModel.findById(userId).lean();
    if (!user) {
      throw new OrderError('User not found', 404, 'USER_NOT_FOUND');
    }

    deliveryAddress = {
      zip: user.address?.zip ?? '',
      street: user.address?.street ?? '',
      city: user.address?.city ?? ''
    };

    if (isAddressIncomplete(deliveryAddress)) {
      throw new OrderError(
        'Address is not set in your profile. Add it in Profile page.',
        400,
        'PROFILE_ADDRESS_REQUIRED'
      );
    }
  } else {
    if (!data.deliveryAddress) {
      throw new OrderError('Delivery address is required', 400, 'VALIDATION_ERROR');
    }

    deliveryAddress = {
      zip: data.deliveryAddress.zip.trim(),
      street: data.deliveryAddress.street.trim(),
      city: data.deliveryAddress.city.trim()
    };
  }

  const productIds = cart.items.map((item) => item.productId);
  const products = await ProductModel.find({ _id: { $in: productIds } });
  const productById = new Map(products.map((product) => [String(product._id), product]));

  for (const item of cart.items) {
    const product = productById.get(String(item.productId));
    if (!product) {
      throw new OrderError('One or more products are unavailable', 409, 'PRODUCT_UNAVAILABLE');
    }

    if (item.quantity > product.stock) {
      throw new OrderError(
        `${product.name} has only ${product.stock} left in stock. Reduce quantity in cart.`,
        409,
        'OUT_OF_STOCK'
      );
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
    totalPrice,
    note: data.note?.trim() ?? '',
    deliveryAddress
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
  const productIds = Array.from(new Set(orders.flatMap((order) => order.items.map((item) => String(item.productId)))));
  const validProductIds = productIds
    .filter((productId) => Types.ObjectId.isValid(productId))
    .map((productId) => new Types.ObjectId(productId));

  const reviewedProducts =
    validProductIds.length === 0 || !Types.ObjectId.isValid(userId)
      ? []
      : await ProductModel.find({
          _id: { $in: validProductIds },
          'reviews.userId': new Types.ObjectId(userId)
        })
          .select('_id reviews')
          .lean();

  const reviewByProductId = new Map(
    reviewedProducts.map((product) => {
      const review = product.reviews.find((entry) => String(entry.userId) === userId);

      return [
        String(product._id),
        review
          ? {
              rating: review.rating,
              comment: review.comment ?? '',
              updatedAt: review.updatedAt?.toISOString() ?? null
            }
          : null
      ];
    })
  );

  return orders.map((order) =>
    buildOrderView({
      ...order,
      items: order.items.map((item) => ({
        ...item,
        review: reviewByProductId.get(String(item.productId)) ?? null
      }))
    })
  );
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
    const address = order.deliveryAddress ?? (isUserPopulated ? user.address : undefined);

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
      note: order.note ?? '',
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

  let data: { status: OrderStatus; note?: string };

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

  const currentStatus = order.status as OrderStatus;
  if (!ORDER_STATUS_TRANSITIONS[currentStatus].includes(data.status)) {
    throw new OrderError('Invalid status transition', 409, 'ORDER_STATUS_TRANSITION_FORBIDDEN');
  }

  order.status = data.status;
  if (data.note !== undefined) {
    order.note = data.note.trim();
  }
  await order.save();

  return {
    id: order.id,
    status: order.status,
    note: order.note ?? ''
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
