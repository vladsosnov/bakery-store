import { Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';

import { ChatWidget } from './ChatWidget';
import * as S from './SiteLayout.styles';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' }
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
            to="/sign-in"
            $variant="ghost"
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            Sign in
          </S.AuthLink>
          <S.AuthLink
            to="/sign-up"
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
