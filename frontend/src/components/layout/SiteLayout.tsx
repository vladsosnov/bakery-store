import { Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';

import { ROUTES } from '@src/app/routes';
import { ChatWidget } from './ChatWidget';
import * as S from './SiteLayout.styles';

const navItems = [
  { to: ROUTES.home, label: 'Home', end: true },
  { to: ROUTES.shop, label: 'Shop' },
  { to: ROUTES.about, label: 'About' }
];

export function SiteLayout() {
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);

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
            to={ROUTES.signIn}
            $variant="ghost"
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            Sign in
          </S.AuthLink>
          <S.AuthLink
            to={ROUTES.signUp}
            $variant="solid"
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            Sign up
          </S.AuthLink>
        </S.Auth>
      </S.Header>

      <S.Content>
        <S.ContentInner>
          <S.RouteTransition key={location.pathname}>
            <Outlet />
          </S.RouteTransition>

          <S.Footer>Bakery Store - Freshly baked with care, every single day.</S.Footer>
        </S.ContentInner>
      </S.Content>

      {isChatOpen ? <ChatWidget onClose={() => setIsChatOpen(false)} /> : null}

      <S.ChatButton
        type="button"
        $open={isChatOpen}
        aria-label={isChatOpen ? 'Close chat' : 'Open chat'}
        onClick={() => setIsChatOpen((prev) => !prev)}
      >
        {isChatOpen ? 'Hide chat' : 'Chat'}
      </S.ChatButton>
    </S.Wrapper>
  );
}
