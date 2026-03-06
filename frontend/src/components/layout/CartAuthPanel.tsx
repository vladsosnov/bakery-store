import type { FC } from 'react';
import { ROUTES } from '@src/app/routes';

import * as S from './styles/CartAuthPanel.styles';

type CartAuthPanelProps = {
  onClose: () => void;
  isAuthenticated: boolean;
  firstName?: string;
};

export const CartAuthPanel: FC<CartAuthPanelProps> = ({ onClose, isAuthenticated, firstName }) => {
  return (
    <S.Panel aria-label="Cart panel">
      <S.Header>
        <S.Title>Cart</S.Title>
        <S.CloseButton type="button" onClick={onClose} aria-label="Close cart panel">
          Close
        </S.CloseButton>
      </S.Header>

      <S.Body>
        {isAuthenticated ? (
          <>
            <S.Message>
              {firstName ? `${firstName}, your cart is empty right now.` : 'Your cart is empty right now.'}
            </S.Message>
            <S.SecondaryMessage>Add products from Shop to start checkout.</S.SecondaryMessage>
          </>
        ) : (
          <>
            <S.Message>Authorize first to access your cart and checkout.</S.Message>
            <S.Actions>
              <S.GhostLink to={ROUTES.signIn} onClick={onClose}>
                Sign in
              </S.GhostLink>
              <S.SolidLink to={ROUTES.signUp} onClick={onClose}>
                Sign up
              </S.SolidLink>
            </S.Actions>
          </>
        )}
      </S.Body>
    </S.Panel>
  );
};
