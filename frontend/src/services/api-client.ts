import axios, { AxiosHeaders } from 'axios';

import { getAuthSession } from './auth-session';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
} as const;

export const apiClient = axios.create({
  headers: DEFAULT_HEADERS
});

export const apiAuthClient = axios.create({
  headers: DEFAULT_HEADERS
});

apiAuthClient.interceptors.request.use((config) => {
  const token = getAuthSession()?.accessToken;
  const headers = AxiosHeaders.from(config.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  } else {
    headers.delete('Authorization');
  }

  config.headers = headers;

  return config;
});
