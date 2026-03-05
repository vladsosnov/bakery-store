export const ROUTE_SEGMENTS = {
  shop: 'shop',
  about: 'about',
  cart: 'cart',
  profile: 'profile',
  signIn: 'sign-in',
  signUp: 'sign-up',
  changePassword: 'change-password'
} as const;

const toRoute = (segment: string) => `/${segment}` as const;

export const ROUTES = {
  home: '/',
  shop: toRoute(ROUTE_SEGMENTS.shop),
  about: toRoute(ROUTE_SEGMENTS.about),
  cart: toRoute(ROUTE_SEGMENTS.cart),
  profile: toRoute(ROUTE_SEGMENTS.profile),
  signIn: toRoute(ROUTE_SEGMENTS.signIn),
  signUp: toRoute(ROUTE_SEGMENTS.signUp),
  changePassword: toRoute(ROUTE_SEGMENTS.changePassword)
} as const;

type ShopCategory = 'Bread' | 'Cakes' | 'Pastries' | 'Cookies';
export type ShopTag = 'New' | 'Bread' | 'Best seller' | 'Party' | 'Artisan' | 'Seasonal' | 'Gift';

export const shopRoutes = {
  base: ROUTES.shop,
  withTag: (tag: ShopTag) => `${ROUTES.shop}?tag=${encodeURIComponent(tag)}`,
  withCategory: (category: ShopCategory) =>
    `${ROUTES.shop}?category=${encodeURIComponent(category)}`
} as const;
