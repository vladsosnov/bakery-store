import axios, { AxiosHeaders } from 'axios';

import { getAuthSession } from './auth-session';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
} as const;

const API_BASE_URL = typeof __API_BASE_URL__ === 'string' ? __API_BASE_URL__ : '';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: DEFAULT_HEADERS
});

export const apiAuthClient = axios.create({
  baseURL: API_BASE_URL,
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
