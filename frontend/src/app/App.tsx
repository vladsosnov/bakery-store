import type { FC } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';

import { AboutPage } from '../components/pages/AboutPage';
import { AdminDashboardPage } from '../components/pages/AdminDashboardPage';
import { CartPage } from '../components/pages/CartPage';
import { ChangePasswordPage } from '../components/pages/ChangePasswordPage';
import { HomePage } from '../components/pages/HomePage';
import { ProfilePage } from '../components/pages/ProfilePage';
import { SignInPage } from '../components/pages/SignInPage';
import { SignUpPage } from '../components/pages/SignUpPage';
import { ShopPage } from '../components/pages/ShopPage';
import { SiteLayout } from '../components/layout/SiteLayout';
import { ROUTES, ROUTE_SEGMENTS } from '@src/app/routes';

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
