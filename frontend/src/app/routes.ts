export const ROUTES = {
  home: '/',
  shop: '/shop',
  about: '/about',
  signIn: '/sign-in',
  signUp: '/sign-up'
} as const;

export const ROUTE_SEGMENTS = {
  shop: 'shop',
  about: 'about',
  signIn: 'sign-in',
  signUp: 'sign-up'
} as const;

type ShopCategory = 'Bread' | 'Cakes' | 'Pastries' | 'Cookies';
export type ShopTag = 'New' | 'Bread' | 'Best seller' | 'Party' | 'Artisan' | 'Seasonal' | 'Gift';

export const shopRoutes = {
  base: ROUTES.shop,
  withTag: (tag: ShopTag) => `${ROUTES.shop}?tag=${encodeURIComponent(tag)}`,
  withCategory: (category: ShopCategory) =>
    `${ROUTES.shop}?category=${encodeURIComponent(category)}`
} as const;
