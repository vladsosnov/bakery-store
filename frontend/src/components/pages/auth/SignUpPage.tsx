import { useState, type FC, type SyntheticEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { ROUTES } from '@src/app/routes';
import { Input } from '@src/components/common/Input';
import { NAME_MAX_LENGTH } from '@src/constants/validation';
import { SubmitButton } from '@src/components/common/SubmitButton';
import { registerUser } from '@src/services/auth-api';
import { setAuthSession } from '@src/services/auth-session';
import { toErrorMessage } from '@src/utils/error';
import * as S from './styles/SignUpPage.styles';

export const SignUpPage: FC = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await registerUser({
        firstName,
        lastName,
        email,
        password
      });

      setAuthSession({
        accessToken: response.data.accessToken,
        user: response.data.user
      });

      toast.success(`Welcome, ${response.data.user.firstName}! Your account is ready.`);
      setPassword('');
      navigate(ROUTES.home);
    } catch (error) {
      toast.error(toErrorMessage(error, 'Failed to create account. Please try again.'));
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
            <Input
              type="text"
              placeholder="Vlad"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              maxLength={NAME_MAX_LENGTH}
              required
            />
          </S.Label>

          <S.Label>
            Last name
            <Input
              type="text"
              placeholder="Sosnov"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              maxLength={NAME_MAX_LENGTH}
              required
            />
          </S.Label>

          <S.Label>
            Email
            <Input
              type="email"
              placeholder="vlad@bakerystore.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </S.Label>

          <S.Label>
            Password
            <Input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
            />
          </S.Label>

          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </SubmitButton>
        </S.Form>

        <S.FooterText>
          Already have an account? <Link to={ROUTES.signIn}>Sign in</Link>
        </S.FooterText>
      </S.Panel>
    </S.Section>
  );
};
