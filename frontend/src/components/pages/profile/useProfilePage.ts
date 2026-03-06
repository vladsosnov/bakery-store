import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { toast } from 'sonner';

import {
  changePasswordByEmail,
  getMyProfile,
  setOwnPassword,
  updateMyProfile
} from '@src/services/auth-api';
import { getAuthSession, updateAuthSessionUser } from '@src/services/auth-session';
import type { UserProfile } from '@src/types/user-profile';
import { toErrorMessage } from '@src/utils/error';

type ProfileForm = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  zip: string;
  street: string;
  city: string;
};

type PasswordForm = {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

const EMPTY_PROFILE_FORM: ProfileForm = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  zip: '',
  street: '',
  city: ''
};

export const useProfilePage = () => {
  const session = useMemo(() => getAuthSession(), []);
  const isCustomer = session?.user.role === 'customer';
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [profileLoadError, setProfileLoadError] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState<ProfileForm>(EMPTY_PROFILE_FORM);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    email: session?.user.email ?? '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [isResetSubmitting, setIsResetSubmitting] = useState(false);
  const [temporaryPassword, setTemporaryPassword] = useState<string | null>(null);
  const [isSetSubmitting, setIsSetSubmitting] = useState(false);

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
        setProfileForm({
          firstName: nextProfile.firstName,
          lastName: nextProfile.lastName,
          phoneNumber: nextProfile.phoneNumber,
          zip: nextProfile.address.zip,
          street: nextProfile.address.street,
          city: nextProfile.address.city
        });
        setPasswordForm((prev) => ({
          ...prev,
          email: nextProfile.email
        }));
      } catch {
        toast.error('Failed to load profile data.');
        setProfileLoadError('Failed to load profile data.');
      } finally {
        setIsProfileLoading(false);
      }
    };

    loadProfile();
  }, [session]);

  const updateProfileFormField = (field: keyof ProfileForm) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setProfileForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const updatePasswordFormField = (field: keyof PasswordForm) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPasswordForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!profile) {
      return;
    }

    setIsProfileSaving(true);

    const payload: Parameters<typeof updateMyProfile>[0] = {
      firstName: profileForm.firstName,
      lastName: profileForm.lastName
    };

    if (profile.role === 'customer') {
      payload.phoneNumber = profileForm.phoneNumber;
      payload.address = {
        zip: profileForm.zip,
        street: profileForm.street,
        city: profileForm.city
      };
    }

    try {
      const response = await updateMyProfile(payload);
      setProfile(response.data);
      updateAuthSessionUser({
        firstName: response.data.firstName,
        lastName: response.data.lastName
      });
      toast.success('Profile updated successfully.');
    } catch (error) {
      toast.error(toErrorMessage(error, 'Failed to update profile. Please try again.'));
    } finally {
      setIsProfileSaving(false);
    }
  };

  const handlePasswordResetSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsResetSubmitting(true);
    setTemporaryPassword(null);

    try {
      const response = await changePasswordByEmail({ email: passwordForm.email });
      toast.success(response.data.message);
      setTemporaryPassword(response.data.temporaryPassword);
    } catch (error) {
      toast.error(toErrorMessage(error, 'Failed to change password. Please try again.'));
    } finally {
      setIsResetSubmitting(false);
    }
  };

  const handleSetOwnPasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!profile) {
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      toast.error('New password and confirmation must match.');
      return;
    }

    setIsSetSubmitting(true);

    try {
      const response = await setOwnPassword({
        email: profile.email,
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      toast.success(response.data.message);
      setPasswordForm((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      }));
    } catch (error) {
      toast.error(toErrorMessage(error, 'Failed to set password. Please try again.'));
    } finally {
      setIsSetSubmitting(false);
    }
  };

  return {
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
  };
};
