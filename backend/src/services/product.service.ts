import { ZodError, z } from 'zod';
import { Types } from 'mongoose';

import { ProductModel } from '../models/product.model.js';
import { PRODUCT_DESCRIPTION_MAX_LENGTH } from '../constants/validation.js';
import { SHOP_TAGS } from '../types/shop-tag.js';

const productListQuerySchema = z.object({
  category: z.string().trim().min(1).optional(),
  tag: z.enum(SHOP_TAGS).optional(),
  search: z.string().trim().min(1).optional()
});

const productCreateSchema = z.object({
  name: z.string().trim().min(1, 'name is required'),
  slug: z.string().trim().min(1, 'slug can not be empty').optional(),
  description: z
    .string()
    .trim()
    .min(1, 'description is required')
    .max(
      PRODUCT_DESCRIPTION_MAX_LENGTH,
      `description must be at most ${PRODUCT_DESCRIPTION_MAX_LENGTH} characters`
    ),
  category: z.string().trim().min(1, 'category is required'),
  price: z.number().min(0, 'price must be greater than or equal to 0'),
  imageUrl: z.string().trim().url('imageUrl must be a valid URL'),
  tags: z.array(z.string().trim().min(1, 'tags can not contain empty values')).default([]),
  isAvailable: z.boolean().default(true),
  stock: z.number().int().min(0, 'stock must be greater than or equal to 0')
});

const productUpdateSchema = z
  .object({
    name: z.string().trim().min(1, 'name is required').optional(),
    slug: z.string().trim().min(1, 'slug can not be empty').optional(),
    description: z
      .string()
      .trim()
      .min(1, 'description is required')
      .max(
        PRODUCT_DESCRIPTION_MAX_LENGTH,
        `description must be at most ${PRODUCT_DESCRIPTION_MAX_LENGTH} characters`
      )
      .optional(),
    category: z.string().trim().min(1, 'category is required').optional(),
    price: z.number().min(0, 'price must be greater than or equal to 0').optional(),
    imageUrl: z.string().trim().url('imageUrl must be a valid URL').optional(),
    tags: z.array(z.string().trim().min(1, 'tags can not contain empty values')).optional(),
    isAvailable: z.boolean().optional(),
    stock: z.number().int().min(0, 'stock must be greater than or equal to 0').optional()
  })
  .refine(
    (payload) =>
      payload.name !== undefined ||
      payload.slug !== undefined ||
      payload.description !== undefined ||
      payload.category !== undefined ||
      payload.price !== undefined ||
      payload.imageUrl !== undefined ||
      payload.tags !== undefined ||
      payload.isAvailable !== undefined ||
      payload.stock !== undefined,
    {
      message: 'At least one field is required'
    }
  );

export type ProductListQuery = z.infer<typeof productListQuerySchema>;
export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;

export class ProductError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.name = 'ProductError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export const parseProductListQuery = (payload: unknown): ProductListQuery => {
  try {
    return productListQuerySchema.parse(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ProductError(error.issues[0]?.message ?? 'Invalid query', 400, 'VALIDATION_ERROR');
    }

    throw error;
  }
};

export const parseCreateProductInput = (payload: unknown): ProductCreateInput => {
  try {
    return productCreateSchema.parse(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ProductError(error.issues[0]?.message ?? 'Invalid request body', 400, 'VALIDATION_ERROR');
    }

    throw error;
  }
};

export const parseUpdateProductInput = (payload: unknown): ProductUpdateInput => {
  try {
    return productUpdateSchema.parse(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ProductError(error.issues[0]?.message ?? 'Invalid request body', 400, 'VALIDATION_ERROR');
    }

    throw error;
  }
};

const toSlug = (input: string) => {
  const normalized = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return normalized || 'product';
};

const ensureUniqueSlug = async (baseSlug: string, ignoreProductId?: string) => {
  let slug = baseSlug;
  let index = 1;

  while (true) {
    const existingProduct = await ProductModel.findOne({
      slug,
      ...(ignoreProductId ? { _id: { $ne: ignoreProductId } } : {})
    })
      .select('_id')
      .lean();

    if (!existingProduct) {
      return slug;
    }

    slug = `${baseSlug}-${index}`;
    index += 1;
  }
};

const normalizeTags = (tags: string[]) => {
  const uniqueTags = new Set(tags.map((tag) => tag.trim()).filter((tag) => tag !== ''));
  return Array.from(uniqueTags);
};

export const listProducts = async (payload: unknown) => {
  const query = parseProductListQuery(payload);

  const filters: {
    isAvailable: boolean;
    category?: string;
    tags?: string;
    $or?: { name?: RegExp; description?: RegExp }[];
  } = {
    isAvailable: true
  };

  if (query.category) {
    filters.category = query.category;
  }

  if (query.tag) {
    filters.tags = query.tag;
  }

  if (query.search) {
    const pattern = new RegExp(query.search, 'i');
    filters.$or = [{ name: pattern }, { description: pattern }];
  }

  return ProductModel.find(filters).sort({ createdAt: -1 }).lean();
};

export const listProductsForAdmin = async () => {
  return ProductModel.find().sort({ createdAt: -1 }).lean();
};

export const createProduct = async (payload: unknown) => {
  const data = parseCreateProductInput(payload);
  const baseSlug = toSlug(data.slug ?? data.name);
  const slug = await ensureUniqueSlug(baseSlug);
  const tags = normalizeTags(data.tags);

  const createdProduct = await ProductModel.create({
    name: data.name,
    slug,
    description: data.description,
    category: data.category,
    price: data.price,
    imageUrl: data.imageUrl,
    tags,
    isAvailable: data.isAvailable,
    stock: data.stock
  });

  return createdProduct.toObject();
};

export const updateProduct = async (productId: string, payload: unknown) => {
  if (!Types.ObjectId.isValid(productId)) {
    throw new ProductError('Product not found', 404, 'PRODUCT_NOT_FOUND');
  }

  const data = parseUpdateProductInput(payload);
  const existingProduct = await ProductModel.findById(productId);

  if (!existingProduct) {
    throw new ProductError('Product not found', 404, 'PRODUCT_NOT_FOUND');
  }

  if (data.name !== undefined) {
    existingProduct.name = data.name;
  }

  if (data.description !== undefined) {
    existingProduct.description = data.description;
  }

  if (data.category !== undefined) {
    existingProduct.category = data.category;
  }

  if (data.price !== undefined) {
    existingProduct.price = data.price;
  }

  if (data.imageUrl !== undefined) {
    existingProduct.imageUrl = data.imageUrl;
  }

  if (data.tags !== undefined) {
    existingProduct.tags = normalizeTags(data.tags);
  }

  if (data.isAvailable !== undefined) {
    existingProduct.isAvailable = data.isAvailable;
  }

  if (data.stock !== undefined) {
    existingProduct.stock = data.stock;
  }

  if (data.slug !== undefined || data.name !== undefined) {
    const nextBaseSlug = toSlug(data.slug ?? data.name ?? existingProduct.name);
    existingProduct.slug = await ensureUniqueSlug(nextBaseSlug, existingProduct.id);
  }

  await existingProduct.save();
  return existingProduct.toObject();
};

export const deleteProduct = async (productId: string) => {
  if (!Types.ObjectId.isValid(productId)) {
    throw new ProductError('Product not found', 404, 'PRODUCT_NOT_FOUND');
  }

  const existingProduct = await ProductModel.findByIdAndDelete(productId);
  if (!existingProduct) {
    throw new ProductError('Product not found', 404, 'PRODUCT_NOT_FOUND');
  }
};
