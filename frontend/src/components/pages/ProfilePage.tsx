import axios from 'axios';
import { useState, type ChangeEvent, type FC, type FormEventHandler } from 'react';

import { changePasswordByEmail, setOwnPassword } from '@src/services/auth-api';
import { getAuthSession } from '@src/services/auth-session';

import * as S from './ProfilePage.styles';

export const ProfilePage: FC = () => {
  const session = getAuthSession();
  const [email, setEmail] = useState(session?.user.email ?? '');
  const [isResetSubmitting, setIsResetSubmitting] = useState(false);
  const [resetStatusMessage, setResetStatusMessage] = useState<string | null>(null);
  const [temporaryPassword, setTemporaryPassword] = useState<string | null>(null);
  const [hasResetError, setHasResetError] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isSetSubmitting, setIsSetSubmitting] = useState(false);
  const [setStatusMessage, setSetStatusMessage] = useState<string | null>(null);
  const [hasSetError, setHasSetError] = useState(false);

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

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordResetSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setIsResetSubmitting(true);
    setResetStatusMessage(null);
    setTemporaryPassword(null);
    setHasResetError(false);

    try {
      const response = await changePasswordByEmail({ email });
      setResetStatusMessage(response.data.message);
      setTemporaryPassword(response.data.temporaryPassword);
    } catch (error) {
      if (axios.isAxiosError<{ error?: string }>(error)) {
        setResetStatusMessage(error.response?.data?.error ?? 'Failed to change password. Please try again.');
      } else {
        setResetStatusMessage('Failed to change password. Please try again.');
      }

      setHasResetError(true);
    } finally {
      setIsResetSubmitting(false);
    }
  };

  const handleCurrentPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(event.target.value);
  };

  const handleNewPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmNewPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setConfirmNewPassword(event.target.value);
  };

  const handleSetOwnPasswordSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setIsSetSubmitting(true);
    setSetStatusMessage(null);
    setHasSetError(false);

    if (newPassword !== confirmNewPassword) {
      setSetStatusMessage('New password and confirmation must match.');
      setHasSetError(true);
      setIsSetSubmitting(false);
      return;
    }

    try {
      const response = await setOwnPassword({
        email: session.user.email,
        currentPassword,
        newPassword
      });

      setSetStatusMessage(response.data.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      if (axios.isAxiosError<{ error?: string }>(error)) {
        setSetStatusMessage(error.response?.data?.error ?? 'Failed to set password. Please try again.');
      } else {
        setSetStatusMessage('Failed to set password. Please try again.');
      }

      setHasSetError(true);
    } finally {
      setIsSetSubmitting(false);
    }
  };

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

      <S.Card>
        <S.BlockTitle>Reset password</S.BlockTitle>
        <S.Subtitle>Generate a temporary password for your account.</S.Subtitle>

        <S.Form onSubmit={handlePasswordResetSubmit}>
          <S.FieldLabel>
            Email
            <S.Input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="vlad@bakerystore.com"
              required
            />
          </S.FieldLabel>

          <S.SubmitButton type="submit" disabled={isResetSubmitting}>
            {isResetSubmitting ? 'Generating...' : 'Generate temporary password'}
          </S.SubmitButton>
        </S.Form>

        {resetStatusMessage ? <S.Status $isError={hasResetError}>{resetStatusMessage}</S.Status> : null}

        {temporaryPassword ? (
          <>
            <S.Subtitle>Your temporary password:</S.Subtitle>
            <S.TempPassword>{temporaryPassword}</S.TempPassword>
          </>
        ) : null}
      </S.Card>

      <S.Card>
        <S.BlockTitle>Set your own password</S.BlockTitle>
        <S.Subtitle>
          Use your current password or generated temporary password, then set a new one.
        </S.Subtitle>

        <S.Form onSubmit={handleSetOwnPasswordSubmit}>
          <S.FieldLabel>
            Current password
            <S.Input
              type="password"
              value={currentPassword}
              onChange={handleCurrentPasswordChange}
              placeholder="Enter current password"
              required
            />
          </S.FieldLabel>

          <S.FieldLabel>
            New password
            <S.Input
              type="password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              placeholder="Enter new password"
              required
            />
          </S.FieldLabel>

          <S.FieldLabel>
            Confirm new password
            <S.Input
              type="password"
              value={confirmNewPassword}
              onChange={handleConfirmNewPasswordChange}
              placeholder="Repeat new password"
              required
            />
          </S.FieldLabel>

          <S.SubmitButton type="submit" disabled={isSetSubmitting}>
            {isSetSubmitting ? 'Saving...' : 'Set new password'}
          </S.SubmitButton>
        </S.Form>

        {setStatusMessage ? <S.Status $isError={hasSetError}>{setStatusMessage}</S.Status> : null}
      </S.Card>
    </S.Section>
  );
};
