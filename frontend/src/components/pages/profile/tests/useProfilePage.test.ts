import { act, renderHook, waitFor } from '@testing-library/react';
import type { ChangeEvent, FormEvent } from 'react';
import { toast } from 'sonner';

import {
  changePasswordByEmail,
  getMyProfile,
  setOwnPassword,
  updateMyProfile
} from '@src/services/auth-api';
import { getAuthSession, updateAuthSessionUser } from '@src/services/auth-session';
import { useProfilePage } from '../useProfilePage';

jest.mock('@src/services/auth-api', () => ({
  getMyProfile: jest.fn(),
  updateMyProfile: jest.fn(),
  changePasswordByEmail: jest.fn(),
  setOwnPassword: jest.fn()
}));

jest.mock('@src/services/auth-session', () => ({
  getAuthSession: jest.fn(),
  updateAuthSessionUser: jest.fn()
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

const mockedGetMyProfile = jest.mocked(getMyProfile);
const mockedUpdateMyProfile = jest.mocked(updateMyProfile);
const mockedChangePasswordByEmail = jest.mocked(changePasswordByEmail);
const mockedSetOwnPassword = jest.mocked(setOwnPassword);
const mockedGetAuthSession = jest.mocked(getAuthSession);
const mockedUpdateAuthSessionUser = jest.mocked(updateAuthSessionUser);
const mockedToastSuccess = jest.mocked(toast.success);
const mockedToastError = jest.mocked(toast.error);

const customerSession = {
  accessToken: 'token',
  user: {
    id: 'u1',
    firstName: 'Vlad',
    lastName: 'Sosnov',
    email: 'vlad@bakery.local',
    role: 'customer' as const
  }
};

const customerProfile = {
  data: {
    id: 'u1',
    firstName: 'Vlad',
    lastName: 'Sosnov',
    email: 'vlad@bakery.local',
    role: 'customer' as const,
    phoneNumber: '+15550001122',
    address: {
      zip: '10001',
      street: '5th Avenue 10',
      city: 'New York'
    }
  }
};

const createFormEvent = () =>
  ({
    preventDefault: jest.fn()
  }) as unknown as FormEvent<HTMLFormElement>;

const createChangeEvent = (value: string) =>
  ({
    target: { value }
  }) as unknown as ChangeEvent<HTMLInputElement>;

describe('useProfilePage', () => {
  beforeEach(() => {
    mockedGetAuthSession.mockReturnValue(customerSession);
    mockedGetMyProfile.mockResolvedValue(customerProfile);
  });

  afterEach(() => {
    mockedGetMyProfile.mockReset();
    mockedUpdateMyProfile.mockReset();
    mockedChangePasswordByEmail.mockReset();
    mockedSetOwnPassword.mockReset();
    mockedGetAuthSession.mockReset();
    mockedUpdateAuthSessionUser.mockReset();
    mockedToastSuccess.mockReset();
    mockedToastError.mockReset();
  });

  it('does not load profile for guest session', () => {
    mockedGetAuthSession.mockReturnValue(null);

    const { result } = renderHook(() => useProfilePage());

    expect(result.current.session).toBeNull();
    expect(result.current.isProfileLoading).toBe(false);
    expect(mockedGetMyProfile).not.toHaveBeenCalled();
  });

  it('loads profile and populates forms for authenticated user', async () => {
    const { result } = renderHook(() => useProfilePage());

    await waitFor(() => {
      expect(result.current.isProfileLoading).toBe(false);
    });

    expect(result.current.profile?.email).toBe('vlad@bakery.local');
    expect(result.current.profileForm.firstName).toBe('Vlad');
    expect(result.current.passwordForm.email).toBe('vlad@bakery.local');
    expect(result.current.isCustomer).toBe(true);
  });

  it('submits customer profile with phone and address', async () => {
    const updatedProfile = {
      ...customerProfile,
      data: {
        ...customerProfile.data,
        firstName: 'Volodymyr'
      }
    };

    mockedUpdateMyProfile.mockResolvedValue(updatedProfile);

    const { result } = renderHook(() => useProfilePage());

    await waitFor(() => {
      expect(result.current.isProfileLoading).toBe(false);
    });

    act(() => {
      result.current.updateProfileFormField('firstName')(createChangeEvent('Volodymyr'));
    });

    await act(async () => {
      await result.current.handleProfileSubmit(createFormEvent());
    });

    expect(mockedUpdateMyProfile).toHaveBeenCalledWith({
      firstName: 'Volodymyr',
      lastName: 'Sosnov',
      phoneNumber: '+15550001122',
      address: {
        zip: '10001',
        street: '5th Avenue 10',
        city: 'New York'
      }
    });
    expect(mockedUpdateAuthSessionUser).toHaveBeenCalledWith({
      firstName: 'Volodymyr',
      lastName: 'Sosnov'
    });
    expect(mockedToastSuccess).toHaveBeenCalledWith('Profile updated successfully.');
  });

  it('submits moderator profile with only first and last names', async () => {
    mockedGetAuthSession.mockReturnValue({
      ...customerSession,
      user: {
        ...customerSession.user,
        role: 'moderator'
      }
    });
    mockedGetMyProfile.mockResolvedValue({
      data: {
        ...customerProfile.data,
        role: 'moderator'
      }
    });
    mockedUpdateMyProfile.mockResolvedValue({
      data: {
        ...customerProfile.data,
        role: 'moderator',
        firstName: 'Marta',
        lastName: 'Baker'
      }
    });

    const { result } = renderHook(() => useProfilePage());

    await waitFor(() => {
      expect(result.current.isProfileLoading).toBe(false);
    });

    act(() => {
      result.current.updateProfileFormField('firstName')(createChangeEvent('Marta'));
      result.current.updateProfileFormField('lastName')(createChangeEvent('Baker'));
    });

    await act(async () => {
      await result.current.handleProfileSubmit(createFormEvent());
    });

    expect(mockedUpdateMyProfile).toHaveBeenCalledWith({
      firstName: 'Marta',
      lastName: 'Baker'
    });
  });

  it('generates temporary password and validates set-password mismatch', async () => {
    mockedChangePasswordByEmail.mockResolvedValue({
      data: {
        message: 'Temporary password generated.',
        temporaryPassword: 'temp-1234'
      }
    });

    const { result } = renderHook(() => useProfilePage());

    await waitFor(() => {
      expect(result.current.isProfileLoading).toBe(false);
    });

    await act(async () => {
      await result.current.handlePasswordResetSubmit(createFormEvent());
    });

    expect(mockedChangePasswordByEmail).toHaveBeenCalledWith({ email: 'vlad@bakery.local' });
    expect(result.current.temporaryPassword).toBe('temp-1234');

    act(() => {
      result.current.updatePasswordFormField('currentPassword')(createChangeEvent('old-password'));
      result.current.updatePasswordFormField('newPassword')(createChangeEvent('new-password-1'));
      result.current.updatePasswordFormField('confirmNewPassword')(createChangeEvent('new-password-2'));
    });

    await act(async () => {
      await result.current.handleSetOwnPasswordSubmit(createFormEvent());
    });

    expect(mockedSetOwnPassword).not.toHaveBeenCalled();
    expect(mockedToastError).toHaveBeenCalledWith('New password and confirmation must match.');
  });
});
