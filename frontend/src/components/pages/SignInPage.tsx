import type { FC } from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@src/app/routes';
import * as S from './SignInPage.styles';

export const SignInPage: FC = () => {
  return (
    <S.Section>
      <S.Panel>
        <S.Eyebrow>Welcome back</S.Eyebrow>
        <S.Title>Sign in</S.Title>
        <S.Subtitle>Continue to your bakery account and manage your orders.</S.Subtitle>

        <S.Form>
          <S.Label>
            Email
            <S.Input type="email" placeholder="vlad@bakerystore.com" />
          </S.Label>

          <S.Label>
            Password
            <S.Input type="password" placeholder="Enter your password" />
          </S.Label>

          <S.SubmitButton type="submit">Sign in</S.SubmitButton>
        </S.Form>

        <S.FooterText>
          New here? <Link to={ROUTES.signUp}>Create an account</Link>
        </S.FooterText>
      </S.Panel>

      <S.AccentPanel>
        <S.AccentTitle>Your daily bakery dashboard</S.AccentTitle>
        <S.AccentText>
          Track orders, save favorite cakes, and receive early access to weekly specials.
        </S.AccentText>
        <S.AccentList>
          <li>Fast checkout with saved details</li>
          <li>Exclusive members-only cake drops</li>
          <li>Order history and invoice access</li>
        </S.AccentList>
      </S.AccentPanel>
    </S.Section>
  );
};
