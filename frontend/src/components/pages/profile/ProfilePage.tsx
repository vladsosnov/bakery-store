import type { FC } from 'react';

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
            <S.Input
              type="text"
              value={profileForm.firstName}
              onChange={updateProfileFormField('firstName')}
              required
            />
          </S.FieldLabel>

          <S.FieldLabel>
            Last name
            <S.Input
              type="text"
              value={profileForm.lastName}
              onChange={updateProfileFormField('lastName')}
              required
            />
          </S.FieldLabel>

          {isCustomer && (
            <>
              <S.FieldLabel>
                Phone number
                <S.Input
                  type="tel"
                  value={profileForm.phoneNumber}
                  onChange={updateProfileFormField('phoneNumber')}
                  required
                />
              </S.FieldLabel>

              <S.FieldLabel>
                ZIP
                <S.Input
                  type="text"
                  value={profileForm.zip}
                  onChange={updateProfileFormField('zip')}
                  required
                />
              </S.FieldLabel>

              <S.FieldLabel>
                Address
                <S.Input
                  type="text"
                  value={profileForm.street}
                  onChange={updateProfileFormField('street')}
                  required
                />
              </S.FieldLabel>

              <S.FieldLabel>
                City
                <S.Input
                  type="text"
                  value={profileForm.city}
                  onChange={updateProfileFormField('city')}
                  required
                />
              </S.FieldLabel>
            </>
          )}

          <S.SubmitButton type="submit" disabled={isProfileSaving}>
            {isProfileSaving ? 'Saving...' : 'Save profile'}
          </S.SubmitButton>
        </S.Form>
      </S.Card>

      <S.Card>
        <S.BlockTitle>Reset password</S.BlockTitle>
        <S.Subtitle>Generate a temporary password for your account.</S.Subtitle>

        <S.Form onSubmit={handlePasswordResetSubmit}>
          <S.FieldLabel>
            Email
            <S.Input
              type="email"
              value={passwordForm.email}
              onChange={updatePasswordFormField('email')}
              placeholder="vlad@bakerystore.com"
              required
            />
          </S.FieldLabel>

          <S.SubmitButton type="submit" disabled={isResetSubmitting}>
            {isResetSubmitting ? 'Generating...' : 'Generate temporary password'}
          </S.SubmitButton>
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
            <S.Input
              type="password"
              value={passwordForm.currentPassword}
              onChange={updatePasswordFormField('currentPassword')}
              placeholder="Enter current password"
              required
            />
          </S.FieldLabel>

          <S.FieldLabel>
            New password
            <S.Input
              type="password"
              value={passwordForm.newPassword}
              onChange={updatePasswordFormField('newPassword')}
              placeholder="Enter new password"
              required
            />
          </S.FieldLabel>

          <S.FieldLabel>
            Confirm new password
            <S.Input
              type="password"
              value={passwordForm.confirmNewPassword}
              onChange={updatePasswordFormField('confirmNewPassword')}
              placeholder="Repeat new password"
              required
            />
          </S.FieldLabel>

          <S.SubmitButton type="submit" disabled={isSetSubmitting}>
            {isSetSubmitting ? 'Saving...' : 'Set new password'}
          </S.SubmitButton>
        </S.Form>
      </S.Card>
    </S.Section>
  );
};
