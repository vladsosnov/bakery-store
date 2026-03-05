import axios from 'axios';
import { useEffect, useMemo, useState, type ChangeEvent, type FC, type FormEventHandler } from 'react';

import {
  changePasswordByEmail,
  getMyProfile,
  setOwnPassword,
  updateMyProfile,
  type UserProfile
} from '@src/services/auth-api';
import { getAuthSession, updateAuthSessionUser } from '@src/services/auth-session';

import * as S from './ProfilePage.styles';

export const ProfilePage: FC = () => {
  const session = useMemo(() => getAuthSession(), []);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [profileLoadError, setProfileLoadError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [zip, setZip] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [profileStatus, setProfileStatus] = useState<string | null>(null);
  const [profileHasError, setProfileHasError] = useState(false);

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

  useEffect(() => {
    if (!session) {
      setIsProfileLoading(false);
      return;
    }

    const loadProfile = async () => {
      setIsProfileLoading(true);
      setProfileLoadError(null);

      try {
        const response = await getMyProfile();
        const nextProfile = response.data;

        setProfile(nextProfile);
        setFirstName(nextProfile.firstName);
        setLastName(nextProfile.lastName);
        setPhoneNumber(nextProfile.phoneNumber);
        setZip(nextProfile.address.zip);
        setStreet(nextProfile.address.street);
        setCity(nextProfile.address.city);
        setEmail(nextProfile.email);
      } catch {
        setProfileLoadError('Failed to load profile data.');
      } finally {
        setIsProfileLoading(false);
      }
    };

    void loadProfile();
  }, [session]);

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

  const isCustomer = profile.role === 'customer';

  const handleFirstNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
  };

  const handlePhoneNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(event.target.value);
  };

  const handleZipChange = (event: ChangeEvent<HTMLInputElement>) => {
    setZip(event.target.value);
  };

  const handleStreetChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStreet(event.target.value);
  };

  const handleCityChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };

  const handleProfileSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setIsProfileSaving(true);
    setProfileStatus(null);
    setProfileHasError(false);

    try {
      const response = await updateMyProfile({
        firstName,
        lastName,
        phoneNumber,
        address: {
          zip,
          street,
          city
        }
      });

      setProfile(response.data);
      updateAuthSessionUser({
        firstName: response.data.firstName,
        lastName: response.data.lastName
      });
      setProfileStatus('Profile updated successfully.');
    } catch (error) {
      if (axios.isAxiosError<{ error?: string }>(error)) {
        setProfileStatus(error.response?.data?.error ?? 'Failed to update profile. Please try again.');
      } else {
        setProfileStatus('Failed to update profile. Please try again.');
      }

      setProfileHasError(true);
    } finally {
      setIsProfileSaving(false);
    }
  };

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
        email: profile.email,
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
          <S.Label>Email</S.Label>
          <S.Value>{profile.email}</S.Value>

          {!isCustomer ? (
            <>
              <S.Label>Role</S.Label>
              <S.Value>{profile.role}</S.Value>
            </>
          ) : null}
        </S.InfoGrid>
      </S.Card>

      <S.Card>
        <S.BlockTitle>Personal info</S.BlockTitle>
        <S.Subtitle>Update your name, phone, and delivery address.</S.Subtitle>

        <S.Form onSubmit={handleProfileSubmit}>
          <S.FieldLabel>
            First name
            <S.Input type="text" value={firstName} onChange={handleFirstNameChange} required />
          </S.FieldLabel>

          <S.FieldLabel>
            Last name
            <S.Input type="text" value={lastName} onChange={handleLastNameChange} required />
          </S.FieldLabel>

          <S.FieldLabel>
            Phone number
            <S.Input type="tel" value={phoneNumber} onChange={handlePhoneNumberChange} required />
          </S.FieldLabel>

          <S.FieldLabel>
            ZIP
            <S.Input type="text" value={zip} onChange={handleZipChange} required />
          </S.FieldLabel>

          <S.FieldLabel>
            Address
            <S.Input type="text" value={street} onChange={handleStreetChange} required />
          </S.FieldLabel>

          <S.FieldLabel>
            City
            <S.Input type="text" value={city} onChange={handleCityChange} required />
          </S.FieldLabel>

          <S.SubmitButton type="submit" disabled={isProfileSaving}>
            {isProfileSaving ? 'Saving...' : 'Save profile'}
          </S.SubmitButton>
        </S.Form>

        {profileStatus ? <S.Status $isError={profileHasError}>{profileStatus}</S.Status> : null}
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
