import type { FC } from 'react';

import { getAuthSession } from '@src/services/auth-session';

import * as S from './CartPage.styles';

export const CartPage: FC = () => {
  const session = getAuthSession();

  if (!session) {
    return (
      <S.Section>
        <S.Card>
          <S.Title>Cart</S.Title>
          <S.Subtitle>Please sign in to access your cart.</S.Subtitle>
        </S.Card>
      </S.Section>
    );
  }

  return (
    <S.Section>
      <S.Card>
        <S.Title>Cart</S.Title>
        <S.Subtitle>
          Hi {session.user.firstName}, your cart is empty for now. Add products from the shop to continue.
        </S.Subtitle>
      </S.Card>
    </S.Section>
  );
};
