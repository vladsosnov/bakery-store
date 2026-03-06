import { ShoppingCart } from 'lucide-react';
import { useEffect, useState, type FC } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { ROUTES } from '@src/app/routes';
import { CartAuthPanel } from '@src/components/layout/CartAuthPanel';
import { ChatWidget } from '@src/components/layout/ChatWidget';
import {
  AUTH_CHANGED_EVENT,
  clearAuthSession,
  getAuthSession
} from '@src/services/auth-session';
import * as S from '@src/components/layout/SiteLayout.styles';

const navItems = [
  { to: ROUTES.home, label: 'Home', end: true },
  { to: ROUTES.shop, label: 'Shop' },
  { to: ROUTES.about, label: 'About' }
];

export const SiteLayout: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [session, setSession] = useState(() => getAuthSession());

  useEffect(() => {
    const syncSession = () => {
      setSession(getAuthSession());
    };

    window.addEventListener(AUTH_CHANGED_EVENT, syncSession);
    window.addEventListener('storage', syncSession);

    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, syncSession);
      window.removeEventListener('storage', syncSession);
    };
  }, []);

  const handleCartButtonClick = () => {
    if (session) {
      setIsCartOpen(false);
      setIsChatOpen(false);
      navigate(ROUTES.cart);
      return;
    }

    setIsCartOpen((prev) => !prev);
    setIsChatOpen(false);
  };

  const handleLogoutClick = () => {
    clearAuthSession();
    navigate(ROUTES.home);
  };

  const handleCartPanelClose = () => {
    setIsCartOpen(false);
  };

  const handleChatPanelClose = () => {
    setIsChatOpen(false);
  };

  const handleChatButtonClick = () => {
    setIsChatOpen((prev) => !prev);
    setIsCartOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCartOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

        <S.HeaderActions>
          <S.CartButton
            type="button"
            $open={isCartOpen}
            aria-label={
              session ? 'Go to cart page' : isCartOpen ? 'Close cart' : 'Open cart'
            }
            onClick={handleCartButtonClick}
          >
            <ShoppingCart size={16} />
            Cart
          </S.CartButton>

          <S.Auth>
            {session ? (
              <>
                {session.user.role === 'admin' || session.user.role === 'moderator' ? (
                  <S.AuthLink
                    to={ROUTES.adminDashboard}
                    $variant="ghost"
                    className={({ isActive }) => (isActive ? 'active' : undefined)}
                  >
                    Admin dashboard
                  </S.AuthLink>
                ) : null}
                <S.AuthLink
                  to={ROUTES.profile}
                  $variant="ghost"
                  className={({ isActive }) => (isActive ? 'active' : undefined)}
                >
                  Profile
                </S.AuthLink>
                <S.LogoutButton
                  type="button"
                  onClick={handleLogoutClick}
                >
                  Logout
                </S.LogoutButton>
              </>
            ) : (
              <>
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
              </>
            )}
          </S.Auth>
        </S.HeaderActions>
      </S.Header>

      <S.Content>
        <S.ContentInner>
          <S.RouteTransition key={location.pathname}>
            <Outlet />
          </S.RouteTransition>

          <S.Footer>Bakery Store - Freshly baked with care, every single day.</S.Footer>
        </S.ContentInner>
      </S.Content>

      {isCartOpen ? (
        <CartAuthPanel
          onClose={handleCartPanelClose}
          isAuthenticated={Boolean(session)}
          firstName={session?.user.firstName}
        />
      ) : null}
      {isChatOpen ? <ChatWidget onClose={handleChatPanelClose} /> : null}

      <S.ChatButton
        type="button"
        $open={isChatOpen}
        aria-label={isChatOpen ? 'Close chat' : 'Open chat'}
        onClick={handleChatButtonClick}
      >
        {isChatOpen ? 'Hide chat' : 'Chat'}
      </S.ChatButton>
    </S.Wrapper>
  );
};
