import axios from 'axios';
import { useState, type ChangeEvent, type FC, type SyntheticEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ROUTES } from '@src/app/routes';
import { loginUser } from '@src/services/auth-api';
import { setAuthSession } from '@src/services/auth-session';
import * as S from './SignInPage.styles';

export const SignInPage: FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);
    setHasError(false);

    try {
      const response = await loginUser({
        email,
        password
      });

      setAuthSession({
        accessToken: response.data.accessToken,
        user: response.data.user
      });
      setStatusMessage(`Welcome back, ${response.data.user.firstName}!`);
      navigate(ROUTES.home);
    } catch (error) {
      if (axios.isAxiosError<{ error?: string }>(error)) {
        setStatusMessage(error.response?.data?.error ?? 'Failed to sign in. Please try again.');
      } else {
        setStatusMessage('Failed to sign in. Please try again.');
      }

      setHasError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <S.Section>
      <S.Panel>
        <S.Eyebrow>Welcome back</S.Eyebrow>
        <S.Title>Sign in</S.Title>
        <S.Subtitle>Continue to your bakery account and manage your orders.</S.Subtitle>

        <S.Form onSubmit={handleSubmit}>
          <S.Label>
            Email
            <S.Input
              type="email"
              placeholder="vlad@bakerystore.com"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </S.Label>

          <S.Label>
            Password
            <S.Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </S.Label>

          <S.SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </S.SubmitButton>
        </S.Form>

        {statusMessage ? (
          <S.FooterText role={hasError ? 'alert' : 'status'} style={{ color: hasError ? '#b42318' : undefined }}>
            {statusMessage}
          </S.FooterText>
        ) : null}

        <S.FooterText>
          <Link to={ROUTES.changePassword}>Forgot password?</Link>
        </S.FooterText>

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
