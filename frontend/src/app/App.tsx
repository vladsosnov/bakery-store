import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AboutPage } from '../components/pages/AboutPage';
import { HomePage } from '../components/pages/HomePage';
import { SignInPage } from '../components/pages/SignInPage';
import { SignUpPage } from '../components/pages/SignUpPage';
import { ShopPage } from '../components/pages/ShopPage';
import { SiteLayout } from '../components/layout/SiteLayout';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="sign-in" element={<SignInPage />} />
          <Route path="sign-up" element={<SignUpPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
