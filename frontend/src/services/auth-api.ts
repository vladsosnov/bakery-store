import axios from 'axios';

const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
});

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
      role: 'customer' | 'moderator' | 'admin';
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
