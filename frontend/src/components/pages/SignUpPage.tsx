import axios from 'axios';
import { useState, type FC, type SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@src/app/routes';
import { registerUser } from '@src/services/auth-api';
import * as S from './SignUpPage.styles';

export const SignUpPage: FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);
    setHasError(false);

    try {
      const response = await registerUser({
        firstName,
        lastName,
        email,
        password
      });

      setStatusMessage(
        `Account created for ${response.data.firstName} ${response.data.lastName}. You can sign in now.`
      );
      setPassword('');
    } catch (error) {
      if (axios.isAxiosError<{ error?: string }>(error)) {
        setStatusMessage(error.response?.data?.error ?? 'Failed to create account. Please try again.');
      } else {
        setStatusMessage('Failed to create account. Please try again.');
      }

      setHasError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <S.Form onSubmit={handleSubmit}>
          <S.Label>
            First name
            <S.Input
              type="text"
              placeholder="Vlad"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              required
            />
          </S.Label>

          <S.Label>
            Last name
            <S.Input
              type="text"
              placeholder="Sosnov"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              required
            />
          </S.Label>

          <S.Label>
            Email
            <S.Input
              type="email"
              placeholder="vlad@bakerystore.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </S.Label>

          <S.Label>
            Password
            <S.Input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
            />
          </S.Label>

          <S.SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </S.SubmitButton>
        </S.Form>

        {statusMessage ? (
          <S.FooterText role={hasError ? 'alert' : 'status'} style={{ color: hasError ? '#b42318' : undefined }}>
            {statusMessage}
          </S.FooterText>
        ) : null}

        <S.FooterText>
          Already have an account? <Link to={ROUTES.signIn}>Sign in</Link>
        </S.FooterText>
      </S.Panel>
    </S.Section>
  );
};
