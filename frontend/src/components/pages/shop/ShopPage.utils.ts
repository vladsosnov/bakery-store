import type { ApiProduct } from '@src/services/product-api';
import type { Category, Product, ProductTag } from '@src/types/shop';
export type { Category, Product, ProductTag, ShopFilterName } from '@src/types/shop';

type ProductFilterInput = {
  activeCategory: Category;
  activeTag: ProductTag;
  search: string;
  veganOnly: boolean;
  glutenFreeOnly: boolean;
  underTwenty: boolean;
};

type AddToCartLabelInput = {
  isBlockedCartRole: boolean;
  addingProductId: string | null;
  productId: string;
  quantityInCart: number;
  stock: number;
};

export const CATEGORIES: Category[] = ['All', 'Bread', 'Cakes', 'Pastries', 'Cookies'];

const inferDietary = (product: ApiProduct) => {
  if (product.dietary) {
    return product.dietary;
  }

  const combinedText = `${product.name} ${product.tags.join(' ')}`.toLowerCase();

  return {
    vegan: combinedText.includes('vegan'),
    glutenFree: combinedText.includes('gluten') || combinedText.includes('almond flour')
  };
};

const toCategory = (category: string): Exclude<Category, 'All'> => {
  const isKnownCategory = CATEGORIES.includes(category as Category) && category !== 'All';

  return isKnownCategory ? (category as Exclude<Category, 'All'>) : 'Pastries';
};

export const mapApiProduct = (product: ApiProduct): Product => {
  return {
    id: product._id,
    name: product.name,
    category: toCategory(product.category),
    price: product.price,
    stock: product.stock,
    image: product.imageUrl,
    description: product.description,
    tags: product.tags,
    dietary: inferDietary(product),
    averageRating: product.averageRating,
    reviewCount: product.reviewCount
  };
};

export const getAvailableTags = (products: Product[], limit = 10): ProductTag[] => {
  const uniqueTags = new Set<string>();

  products.forEach((product) => {
    product.tags.forEach((tag) => uniqueTags.add(tag));
  });

  return ['All', ...Array.from(uniqueTags).slice(0, limit)];
};

export const filterProducts = (products: Product[], filters: ProductFilterInput): Product[] => {
  return products.filter((product) => {
    const byCategory = filters.activeCategory === 'All' || product.category === filters.activeCategory;
    const bySearch =
      product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.description.toLowerCase().includes(filters.search.toLowerCase());
    const byVegan = !filters.veganOnly || product.dietary.vegan;
    const byGlutenFree = !filters.glutenFreeOnly || product.dietary.glutenFree;
    const byPrice = !filters.underTwenty || product.price < 20;
    const byTag = filters.activeTag === 'All' || product.tags.includes(filters.activeTag);

    return byCategory && bySearch && byVegan && byGlutenFree && byPrice && byTag;
  });
};

export const getAddToCartLabel = (input: AddToCartLabelInput): string => {
  if (input.isBlockedCartRole) {
    return 'Unavailable';
  }

  if (input.addingProductId === input.productId) {
    return 'Adding...';
  }

  if (input.quantityInCart >= input.stock) {
    return 'Max in cart';
  }

  return 'Add to cart';
};

export const isAddToCartDisabled = (input: AddToCartLabelInput): boolean => {
  return (
    input.isBlockedCartRole ||
    input.addingProductId === input.productId ||
    input.quantityInCart >= input.stock
  );
};
