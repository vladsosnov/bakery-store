import type { FC } from 'react';

import { Input } from '@src/components/common/Input';
import { NAME_MAX_LENGTH } from '@src/constants/validation';
import { SubmitButton } from '@src/components/common/SubmitButton';
import { useProfilePage } from '@src/components/pages/profile/useProfilePage';
import * as S from './ProfilePage.styles';

export const ProfilePage: FC = () => {
  const {
    session,
    profile,
    isProfileLoading,
    profileLoadError,
    isCustomer,
    profileForm,
    isProfileSaving,
    passwordForm,
    isResetSubmitting,
    temporaryPassword,
    isSetSubmitting,
    updateProfileFormField,
    updatePasswordFormField,
    handleProfileSubmit,
    handlePasswordResetSubmit,
    handleSetOwnPasswordSubmit
  } = useProfilePage();

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

  if (isProfileLoading) {
    return (
      <S.Section>
        <S.Card>
          <S.Title>Profile</S.Title>
          <S.Subtitle>Loading profile...</S.Subtitle>
        </S.Card>
      </S.Section>
    );
  }

  if (profileLoadError || !profile) {
    return (
      <S.Section>
        <S.Card>
          <S.Title>Profile</S.Title>
          <S.Subtitle>{profileLoadError ?? 'Profile is not available.'}</S.Subtitle>
        </S.Card>
      </S.Section>
    );
  }

  return (
    <S.Section>
      <S.Card>
        <S.BlockTitle>Personal info</S.BlockTitle>

        <S.InfoGrid>
          <S.Label>Email</S.Label>
          <S.Value>{profile.email}</S.Value>
        </S.InfoGrid>

        {!isCustomer && <S.InfoGrid>
          <S.Label>Role</S.Label>
          <S.Value>{profile.role}</S.Value>
        </S.InfoGrid>}

        <S.Form onSubmit={handleProfileSubmit}>
          <S.FieldLabel>
            First name
            <Input
              type="text"
              value={profileForm.firstName}
              onChange={updateProfileFormField('firstName')}
              maxLength={NAME_MAX_LENGTH}
              disabled={isProfileSaving}
              required
            />
          </S.FieldLabel>

          <S.FieldLabel>
            Last name
            <Input
              type="text"
              value={profileForm.lastName}
              onChange={updateProfileFormField('lastName')}
              maxLength={NAME_MAX_LENGTH}
              disabled={isProfileSaving}
              required
            />
          </S.FieldLabel>

          {isCustomer && (
            <>
              <S.FieldLabel>
                Phone number
                <Input
                  type="tel"
                  value={profileForm.phoneNumber}
                  onChange={updateProfileFormField('phoneNumber')}
                  disabled={isProfileSaving}
                  required
                />
              </S.FieldLabel>

              <S.FieldLabel>
                ZIP
                <Input
                  type="text"
                  value={profileForm.zip}
                  onChange={updateProfileFormField('zip')}
                  disabled={isProfileSaving}
                  required
                />
              </S.FieldLabel>

              <S.FieldLabel>
                Address
                <Input
                  type="text"
                  value={profileForm.street}
                  onChange={updateProfileFormField('street')}
                  disabled={isProfileSaving}
                  required
                />
              </S.FieldLabel>

              <S.FieldLabel>
                City
                <Input
                  type="text"
                  value={profileForm.city}
                  onChange={updateProfileFormField('city')}
                  disabled={isProfileSaving}
                  required
                />
              </S.FieldLabel>
            </>
          )}

          <SubmitButton type="submit" disabled={isProfileSaving}>
            {isProfileSaving ? 'Saving...' : 'Save profile'}
          </SubmitButton>
        </S.Form>
      </S.Card>

      <S.Card>
        <S.BlockTitle>Reset password</S.BlockTitle>
        <S.Subtitle>Generate a temporary password for your account.</S.Subtitle>

        <S.Form onSubmit={handlePasswordResetSubmit}>
          <S.FieldLabel>
            Email
            <Input
              type="email"
              value={passwordForm.email}
              onChange={updatePasswordFormField('email')}
              placeholder="vlad@bakerystore.com"
              disabled={isResetSubmitting}
              required
            />
          </S.FieldLabel>

          <SubmitButton type="submit" disabled={isResetSubmitting}>
            {isResetSubmitting ? 'Generating...' : 'Generate temporary password'}
          </SubmitButton>
        </S.Form>

        {temporaryPassword && (
          <>
            <S.Subtitle>Your temporary password:</S.Subtitle>
            <S.TempPassword>{temporaryPassword}</S.TempPassword>
          </>
        )}
      </S.Card>

      <S.Card>
        <S.BlockTitle>Set your own password</S.BlockTitle>
        <S.Subtitle>
          Use your current password or generated temporary password, then set a new one.
        </S.Subtitle>

        <S.Form onSubmit={handleSetOwnPasswordSubmit}>
          <S.FieldLabel>
            Current password
            <Input
              type="password"
              value={passwordForm.currentPassword}
              onChange={updatePasswordFormField('currentPassword')}
              placeholder="Enter current password"
              disabled={isSetSubmitting}
              required
            />
          </S.FieldLabel>

          <S.FieldLabel>
            New password
            <Input
              type="password"
              value={passwordForm.newPassword}
              onChange={updatePasswordFormField('newPassword')}
              placeholder="Enter new password"
              disabled={isSetSubmitting}
              required
            />
          </S.FieldLabel>

          <S.FieldLabel>
            Confirm new password
            <Input
              type="password"
              value={passwordForm.confirmNewPassword}
              onChange={updatePasswordFormField('confirmNewPassword')}
              placeholder="Repeat new password"
              disabled={isSetSubmitting}
              required
            />
          </S.FieldLabel>

          <SubmitButton type="submit" disabled={isSetSubmitting}>
            {isSetSubmitting ? 'Saving...' : 'Set new password'}
          </SubmitButton>
        </S.Form>
      </S.Card>
    </S.Section>
  );
};
