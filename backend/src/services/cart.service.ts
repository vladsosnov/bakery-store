import { Types } from 'mongoose';
import { ZodError, z } from 'zod';

import { CartModel } from '../models/cart.model.js';
import { ProductModel } from '../models/product.model.js';

type CartItemView = {
  productId: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  availableStock: number;
  lineTotal: number;
};

type CartView = {
  items: CartItemView[];
  totalItems: number;
  totalPrice: number;
};

const addCartItemSchema = z.object({
  productId: z.string().min(1, 'productId is required'),
  quantity: z.coerce.number().int().positive().default(1)
});

const updateCartItemQuantitySchema = z.object({
  quantity: z.coerce.number().int().positive()
});

export type AddCartItemInput = z.infer<typeof addCartItemSchema>;
export type UpdateCartItemQuantityInput = z.infer<typeof updateCartItemQuantitySchema>;

export class CartError extends Error {
  statusCode: number;
  code: string;
  meta?: Record<string, unknown>;

  constructor(message: string, statusCode: number, code: string, meta?: Record<string, unknown>) {
    super(message);
    this.name = 'CartError';
    this.statusCode = statusCode;
    this.code = code;
    this.meta = meta;
  }
}

export const parseAddCartItemInput = (payload: unknown): AddCartItemInput => {
  try {
    return addCartItemSchema.parse(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new CartError(error.issues[0]?.message ?? 'Invalid request body', 400, 'VALIDATION_ERROR');
    }

    throw error;
  }
};

export const parseUpdateCartItemQuantityInput = (payload: unknown): UpdateCartItemQuantityInput => {
  try {
    return updateCartItemQuantitySchema.parse(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new CartError(error.issues[0]?.message ?? 'Invalid request body', 400, 'VALIDATION_ERROR');
    }

    throw error;
  }
};

const toObjectId = (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new CartError('Invalid product id', 400, 'VALIDATION_ERROR');
  }

  return new Types.ObjectId(id);
};

const buildCartView = async (
  items: Array<{ productId: Types.ObjectId; quantity: number }>
): Promise<CartView> => {
  if (items.length === 0) {
    return {
      items: [],
      totalItems: 0,
      totalPrice: 0
    };
  }

  const productIds = items.map((item) => item.productId);
  const products = await ProductModel.find({ _id: { $in: productIds } }).lean();

  const productById = new Map(products.map((product) => [String(product._id), product]));

  const resolvedItems = items
    .map((item) => {
      const product = productById.get(String(item.productId));
      if (!product) {
        return null;
      }

      return {
        productId: String(item.productId),
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
        quantity: item.quantity,
        availableStock: product.stock,
        lineTotal: Number((item.quantity * product.price).toFixed(2))
      } satisfies CartItemView;
    })
    .filter((item): item is CartItemView => item !== null);

  const totalItems = resolvedItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = Number(resolvedItems.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2));

  return {
    items: resolvedItems,
    totalItems,
    totalPrice
  };
};

export const getCart = async (userId: string) => {
  const cart = await CartModel.findOne({ userId }).lean();
  return buildCartView((cart?.items ?? []) as Array<{ productId: Types.ObjectId; quantity: number }>);
};

export const addItemToCart = async (userId: string, payload: unknown) => {
  const data = parseAddCartItemInput(payload);
  const productObjectId = toObjectId(data.productId);

  const product = await ProductModel.findOne({ _id: productObjectId, isAvailable: true }).lean();
  if (!product) {
    throw new CartError('Product not found', 404, 'PRODUCT_NOT_FOUND');
  }

  const cart = await CartModel.findOneAndUpdate(
    { userId },
    { $setOnInsert: { userId, items: [] } },
    { new: true, upsert: true }
  );

  const existingItem = cart.items.find((item) => String(item.productId) === String(productObjectId));
  const currentQuantity = existingItem?.quantity ?? 0;
  const nextQuantity = currentQuantity + data.quantity;

  if (nextQuantity > product.stock) {
    throw new CartError('Not enough stock available', 409, 'OUT_OF_STOCK', {
      availableStock: product.stock,
      currentInCart: currentQuantity,
      requestedToAdd: data.quantity
    });
  }

  if (existingItem) {
    existingItem.quantity = nextQuantity;
  } else {
    cart.items.push({ productId: productObjectId, quantity: data.quantity });
  }

  await cart.save();

  return buildCartView(
    cart.items as unknown as Array<{
      productId: Types.ObjectId;
      quantity: number;
    }>
  );
};

export const updateCartItemQuantity = async (userId: string, productId: string, payload: unknown) => {
  const data = parseUpdateCartItemQuantityInput(payload);
  const productObjectId = toObjectId(productId);

  const product = await ProductModel.findOne({ _id: productObjectId, isAvailable: true }).lean();
  if (!product) {
    throw new CartError('Product not found', 404, 'PRODUCT_NOT_FOUND');
  }

  if (data.quantity > product.stock) {
    throw new CartError('Not enough stock available', 409, 'OUT_OF_STOCK', {
      availableStock: product.stock,
      requestedQuantity: data.quantity
    });
  }

  const cart = await CartModel.findOne({ userId });
  if (!cart) {
    throw new CartError('Product is not in cart', 404, 'CART_ITEM_NOT_FOUND');
  }

  const existingItem = cart.items.find((item) => String(item.productId) === String(productObjectId));
  if (!existingItem) {
    throw new CartError('Product is not in cart', 404, 'CART_ITEM_NOT_FOUND');
  }

  existingItem.quantity = data.quantity;
  await cart.save();

  return buildCartView(
    cart.items as unknown as Array<{
      productId: Types.ObjectId;
      quantity: number;
    }>
  );
};

export const removeCartItem = async (userId: string, productId: string) => {
  const productObjectId = toObjectId(productId);
  const cart = await CartModel.findOne({ userId });

  if (!cart) {
    return {
      items: [],
      totalItems: 0,
      totalPrice: 0
    };
  }

  for (let index = cart.items.length - 1; index >= 0; index -= 1) {
    if (String(cart.items[index]!.productId) === String(productObjectId)) {
      cart.items.splice(index, 1);
    }
  }
  await cart.save();

  return buildCartView(
    cart.items as unknown as Array<{
      productId: Types.ObjectId;
      quantity: number;
    }>
  );
};
