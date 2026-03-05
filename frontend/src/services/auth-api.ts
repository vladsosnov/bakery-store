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

type RegisterResponse = {
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'customer' | 'moderator' | 'admin';
  };
};

export const registerUser = async (payload: RegisterRequest) => {
  const response = await apiClient.post<RegisterResponse>('/api/auth/register', payload);

  return response.data;
};
