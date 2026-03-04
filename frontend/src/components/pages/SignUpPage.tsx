import { Link } from 'react-router-dom';

import { ROUTES } from '../../app/routes';
import * as S from './SignUpPage.styles';

export function SignUpPage() {
  return (
    <S.Section>
      <S.AccentPanel>
        <S.AccentTitle>Create your account</S.AccentTitle>
        <S.AccentText>
          Join Bakery Store to get personalized offers, easy reorders, and seasonal cake alerts.
        </S.AccentText>
        <S.AccentList>
          <li>Save delivery details securely</li>
          <li>Receive early discounts</li>
          <li>Get recommended products based on your taste</li>
        </S.AccentList>
      </S.AccentPanel>

      <S.Panel>
        <S.Eyebrow>Start here</S.Eyebrow>
        <S.Title>Sign up</S.Title>
        <S.Subtitle>It takes less than a minute.</S.Subtitle>

        <S.Form>
          <S.Label>
            Full Name
            <S.Input type="text" placeholder="Vlad Sosnov" />
          </S.Label>

          <S.Label>
            Email
            <S.Input type="email" placeholder="vlad@bakerystore.com" />
          </S.Label>

          <S.Label>
            Password
            <S.Input type="password" placeholder="Create a password" />
          </S.Label>

          <S.SubmitButton type="submit">Create account</S.SubmitButton>
        </S.Form>

        <S.FooterText>
          Already have an account? <Link to={ROUTES.signIn}>Sign in</Link>
        </S.FooterText>
      </S.Panel>
    </S.Section>
  );
}
