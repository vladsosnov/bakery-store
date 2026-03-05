import type { FC } from 'react';

import { getAuthSession } from '@src/services/auth-session';

import * as S from './ProfilePage.styles';

export const ProfilePage: FC = () => {
  const session = getAuthSession();

  if (!session) {
    return (
      <S.Section>
        <S.Card>
          <S.Title>Profile</S.Title>
          <S.Subtitle>Please sign in to view your profile.</S.Subtitle>
        </S.Card>
      </S.Section>
    );
  }

  return (
    <S.Section>
      <S.Card>
        <S.Title>Profile</S.Title>
        <S.Subtitle>Your account details.</S.Subtitle>

        <S.InfoGrid>
          <S.Label>First name</S.Label>
          <S.Value>{session.user.firstName}</S.Value>

          <S.Label>Last name</S.Label>
          <S.Value>{session.user.lastName}</S.Value>

          <S.Label>Email</S.Label>
          <S.Value>{session.user.email}</S.Value>

          <S.Label>Role</S.Label>
          <S.Value>{session.user.role}</S.Value>
        </S.InfoGrid>
      </S.Card>
    </S.Section>
  );
};
