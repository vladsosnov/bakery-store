import { ZodError, z } from 'zod';

import { ProductModel } from '../models/product.model.js';

type ProductSeed = {
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

const productListQuerySchema = z.object({
  category: z.string().trim().min(1).optional(),
  tag: z.string().trim().min(1).optional(),
  search: z.string().trim().min(1).optional()
});

const PRODUCTS_SEED: ProductSeed[] = [
  {
    name: 'Butter croissant',
    slug: 'butter-croissant',
    description: 'Flaky laminated pastry with cultured butter.',
    category: 'Pastries',
    price: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80',
    tags: ['Best seller'],
    isAvailable: true,
    stock: 3
  },
  {
    name: 'Chocolate celebration cake',
    slug: 'chocolate-celebration-cake',
    description: 'Rich cocoa sponge with silky ganache layers.',
    category: 'Cakes',
    price: 42,
    imageUrl: 'https://images.unsplash.com/photo-1602351447937-745cb720612f?auto=format&fit=crop&w=900&q=80',
    tags: ['Party'],
    isAvailable: true,
    stock: 12
  },
  {
    name: 'Sourdough loaf',
    slug: 'sourdough-loaf',
    description: 'Naturally fermented bread with deep flavor.',
    category: 'Bread',
    price: 8,
    imageUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=900&q=80',
    tags: ['Bread', 'Artisan'],
    isAvailable: true,
    stock: 25
  },
  {
    name: 'Strawberry shortcake',
    slug: 'strawberry-shortcake',
    description: 'Fresh cream cake layered with seasonal strawberries.',
    category: 'Cakes',
    price: 36,
    imageUrl: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=80',
    tags: ['Seasonal'],
    isAvailable: true,
    stock: 10
  },
  {
    name: 'Almond flour cookie box',
    slug: 'almond-flour-cookie-box',
    description: 'Crunchy almond cookies with vanilla notes.',
    category: 'Cookies',
    price: 14,
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=80',
    tags: ['Gift'],
    isAvailable: true,
    stock: 18
  },
  {
    name: 'Vegan cinnamon roll',
    slug: 'vegan-cinnamon-roll',
    description: 'Soft swirl pastry with cinnamon glaze.',
    category: 'Pastries',
    price: 5.5,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
    tags: ['New'],
    isAvailable: true,
    stock: 22
  }
];

export type ProductListQuery = z.infer<typeof productListQuerySchema>;

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

export const seedProductsCatalog = async () => {
  const operations = PRODUCTS_SEED.map((product) => ({
    updateOne: {
      filter: { slug: product.slug },
      update: { $set: product },
      upsert: true
    }
  }));

  await ProductModel.bulkWrite(operations);
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
