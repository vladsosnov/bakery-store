import type { ShopTag } from '../../../backend/src/types/shop-tag';

export const ROUTE_SEGMENTS = {
  shop: 'shop',
  about: 'about',
  cart: 'cart',
  orders: 'orders',
  profile: 'profile',
  adminDashboard: 'admin',
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
  orders: toRoute(ROUTE_SEGMENTS.orders),
  profile: toRoute(ROUTE_SEGMENTS.profile),
  adminDashboard: toRoute(ROUTE_SEGMENTS.adminDashboard),
  signIn: toRoute(ROUTE_SEGMENTS.signIn),
  signUp: toRoute(ROUTE_SEGMENTS.signUp),
  changePassword: toRoute(ROUTE_SEGMENTS.changePassword)
} as const;

type ShopCategory = 'Bread' | 'Cakes' | 'Pastries' | 'Cookies';

export const shopRoutes = {
  base: ROUTES.shop,
  withTag: (tag: ShopTag) => `${ROUTES.shop}?tag=${encodeURIComponent(tag)}`,
  withCategory: (category: ShopCategory) =>
    `${ROUTES.shop}?category=${encodeURIComponent(category)}`
} as const;
