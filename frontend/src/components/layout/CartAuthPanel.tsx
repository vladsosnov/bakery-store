import type { FC } from 'react';
import { ROUTES } from '@src/app/routes';

import * as S from './CartAuthPanel.styles';

type CartAuthPanelProps = {
  onClose: () => void;
};

export const CartAuthPanel: FC<CartAuthPanelProps> = ({ onClose }) => {
  return (
    <S.Panel aria-label="Cart panel">
      <S.Header>
        <S.Title>Cart</S.Title>
        <S.CloseButton type="button" onClick={onClose} aria-label="Close cart panel">
          Close
        </S.CloseButton>
      </S.Header>

      <S.Body>
        <S.Message>Authorize first to access your cart and checkout.</S.Message>
        <S.Actions>
          <S.GhostLink to={ROUTES.signIn} onClick={onClose}>
            Sign in
          </S.GhostLink>
          <S.SolidLink to={ROUTES.signUp} onClick={onClose}>
            Sign up
          </S.SolidLink>
        </S.Actions>
      </S.Body>
    </S.Panel>
  );
};
