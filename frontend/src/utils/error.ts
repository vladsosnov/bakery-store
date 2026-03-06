import axios from 'axios';

export const toErrorMessage = (error: unknown, fallback: string) => {
  return axios.isAxiosError<{ error?: string }>(error) ? error.response?.data?.error ?? fallback : fallback;
};
