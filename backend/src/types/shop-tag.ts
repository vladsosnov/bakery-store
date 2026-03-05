export const SHOP_TAGS = [
  'New',
  'Bread',
  'Best seller',
  'Party',
  'Artisan',
  'Seasonal',
  'Gift'
] as const;

export type ShopTag = (typeof SHOP_TAGS)[number];
