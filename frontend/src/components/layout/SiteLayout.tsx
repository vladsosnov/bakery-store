import { Outlet, useLocation } from 'react-router-dom';

import * as S from './SiteLayout.styles';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' }
];

export function SiteLayout() {
  const location = useLocation();

  return (
    <S.Wrapper>
      <S.Header>
        <S.Brand>Bakery Store</S.Brand>

        <S.Nav aria-label="Main navigation">
          {navItems.map((item) => (
            <S.NavItem
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              {item.label}
            </S.NavItem>
          ))}
        </S.Nav>

        <S.Auth>
          <S.AuthLink
            to="/sign-in"
            $variant="ghost"
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            Sign In
          </S.AuthLink>
          <S.AuthLink
            to="/sign-up"
            $variant="solid"
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            Sign Up
          </S.AuthLink>
        </S.Auth>
      </S.Header>

      <S.Content>
        <S.RouteTransition key={location.pathname} className="route-transition">
          <Outlet />
        </S.RouteTransition>
      </S.Content>

      <S.Footer>Bakery Store - Freshly baked with care, every single day.</S.Footer>

      <S.ChatButton type="button" aria-label="Open chat" title="Chat coming soon">
        Chat
      </S.ChatButton>
    </S.Wrapper>
  );
}
