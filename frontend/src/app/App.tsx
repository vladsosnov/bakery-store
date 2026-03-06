import type { FC } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';

import { AboutPage } from '@src/components/pages/about/AboutPage';
import { AdminDashboardPage } from '@src/components/pages/admin-dashboard/AdminDashboardPage';
import { ChangePasswordPage } from '@src/components/pages/auth/ChangePasswordPage';
import { ProfilePage } from '@src/components/pages/profile/ProfilePage';
import { HomePage } from '@src/components/pages/home/HomePage';
import { MyOrdersPage } from '@src/components/pages/orders/MyOrdersPage';
import { SignInPage } from '@src/components/pages/auth/SignInPage';
import { SignUpPage } from '@src/components/pages/auth/SignUpPage';
import { ShopPage } from '@src/components/pages/shop/ShopPage';
import { SiteLayout } from '@src/components/layout/SiteLayout';
import { ROUTES, ROUTE_SEGMENTS } from '@src/app/routes';
import { CartPage } from '@src/components/pages/cart/CartPage';

export const App: FC = () => {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path={ROUTE_SEGMENTS.shop} element={<ShopPage />} />
          <Route path={ROUTE_SEGMENTS.about} element={<AboutPage />} />
          <Route path={ROUTE_SEGMENTS.cart} element={<CartPage />} />
          <Route path={ROUTE_SEGMENTS.orders} element={<MyOrdersPage />} />
          <Route path={ROUTE_SEGMENTS.profile} element={<ProfilePage />} />
          <Route path={ROUTE_SEGMENTS.adminDashboard} element={<AdminDashboardPage />} />
          <Route path={ROUTE_SEGMENTS.signIn} element={<SignInPage />} />
          <Route path={ROUTE_SEGMENTS.signUp} element={<SignUpPage />} />
          <Route path={ROUTE_SEGMENTS.changePassword} element={<ChangePasswordPage />} />
        </Route>
        <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
      </Routes>
    </BrowserRouter>
  );
};
