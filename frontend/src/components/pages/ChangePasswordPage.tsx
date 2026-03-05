import axios from 'axios';
import { useState, type ChangeEvent, type FC, type FormEventHandler } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'sonner';

import { ROUTES } from '@src/app/routes';
import { changePasswordByEmail } from '@src/services/auth-api';
import { getAuthSession } from '@src/services/auth-session';
import * as S from './ChangePasswordPage.styles';

export const ChangePasswordPage: FC = () => {
  const session = getAuthSession();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [temporaryPassword, setTemporaryPassword] = useState<string | null>(null);

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);
    setTemporaryPassword(null);

    try {
      const response = await changePasswordByEmail({ email });
      setStatusMessage(response.data.message);
      setTemporaryPassword(response.data.temporaryPassword);
    } catch (error) {
      const errorMessage = axios.isAxiosError<{ error?: string }>(error)
        ? error.response?.data?.error ?? 'Failed to change password. Please try again.'
        : 'Failed to change password. Please try again.';
      toast.error(errorMessage);
      setStatusMessage(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (session) {
    return <Navigate to={ROUTES.profile} replace />;
  }

  return (
    <S.Section>
      <S.Panel>
        <S.Eyebrow>Account recovery</S.Eyebrow>
        <S.Title>Change password</S.Title>
        <S.Subtitle>
          Enter your account email and we will generate a temporary password for immediate sign in.
        </S.Subtitle>

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

          <S.SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Generating...' : 'Generate temporary password'}
          </S.SubmitButton>
        </S.Form>

        {statusMessage ? <S.Status $isError={false}>{statusMessage}</S.Status> : null}

        {temporaryPassword ? (
          <>
            <S.FooterText>Your temporary password:</S.FooterText>
            <S.TempPassword>{temporaryPassword}</S.TempPassword>
          </>
        ) : null}

        <S.FooterText>
          Back to <Link to={ROUTES.signIn}>Sign in</Link>
        </S.FooterText>
      </S.Panel>
    </S.Section>
  );
};
