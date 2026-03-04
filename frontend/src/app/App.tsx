import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AboutPage } from '../components/pages/AboutPage';
import { HomePage } from '../components/pages/HomePage';
import { SignInPage } from '../components/pages/SignInPage';
import { SignUpPage } from '../components/pages/SignUpPage';
import { ShopPage } from '../components/pages/ShopPage';
import { SiteLayout } from '../components/layout/SiteLayout';
import { ROUTES, ROUTE_SEGMENTS } from './routes';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path={ROUTE_SEGMENTS.shop} element={<ShopPage />} />
          <Route path={ROUTE_SEGMENTS.about} element={<AboutPage />} />
          <Route path={ROUTE_SEGMENTS.signIn} element={<SignInPage />} />
          <Route path={ROUTE_SEGMENTS.signUp} element={<SignUpPage />} />
        </Route>
        <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
