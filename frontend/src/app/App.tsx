import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AboutPage } from '../components/AboutPage';
import { HomePage } from '../components/HomePage';
import { ShopPage } from '../components/ShopPage';
import { SiteLayout } from '../components/layout/SiteLayout';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
