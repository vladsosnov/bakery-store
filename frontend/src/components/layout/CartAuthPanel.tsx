import { ROUTES } from '@src/app/routes';

import * as S from './CartAuthPanel.styles';

type CartAuthPanelProps = {
  onClose: () => void;
};

export function CartAuthPanel({ onClose }: CartAuthPanelProps) {
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
          <S.GhostLink to={ROUTES.signIn}>Sign in</S.GhostLink>
          <S.SolidLink to={ROUTES.signUp}>Sign up</S.SolidLink>
        </S.Actions>
      </S.Body>
    </S.Panel>
  );
}
