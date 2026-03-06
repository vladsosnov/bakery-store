import type { UserRole } from '@src/types/user-role';
import { apiAuthClient, apiClient } from './api-client';

type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type AuthResponse = {
  data: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: UserRole;
    };
    accessToken: string;
  };
};

export const registerUser = async (payload: RegisterRequest) => {
  const response = await apiClient.post<AuthResponse>('/api/auth/register', payload);

  return response.data;
};

type LoginRequest = {
  email: string;
  password: string;
};

export const loginUser = async (payload: LoginRequest) => {
  const response = await apiClient.post<AuthResponse>('/api/auth/login', payload);

  return response.data;
};

type ChangePasswordRequest = {
  email: string;
};

type ChangePasswordResponse = {
  data: {
    message: string;
    temporaryPassword: string;
  };
};

export const changePasswordByEmail = async (payload: ChangePasswordRequest) => {
  const response = await apiClient.post<ChangePasswordResponse>('/api/auth/change-password', payload);

  return response.data;
};

type SetPasswordRequest = {
  email: string;
  currentPassword: string;
  newPassword: string;
};

type SetPasswordResponse = {
  data: {
    message: string;
  };
};

export const setOwnPassword = async (payload: SetPasswordRequest) => {
  const response = await apiClient.post<SetPasswordResponse>('/api/auth/set-password', payload);

  return response.data;
};

export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phoneNumber: string;
  address: {
    zip: string;
    street: string;
    city: string;
  };
};

type UserProfileResponse = {
  data: UserProfile;
};

type UpdateProfileRequest = {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: {
    zip: string;
    street: string;
    city: string;
  };
};

export const getMyProfile = async () => {
  const response = await apiAuthClient.get<UserProfileResponse>('/api/auth/me');

  return response.data;
};

export const updateMyProfile = async (payload: UpdateProfileRequest) => {
  const response = await apiAuthClient.patch<UserProfileResponse>('/api/auth/profile', payload);

  return response.data;
};
