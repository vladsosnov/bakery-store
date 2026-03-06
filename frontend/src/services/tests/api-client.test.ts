import type { InternalAxiosRequestConfig } from 'axios';

import { apiAuthClient, apiClient } from '../api-client';
import { getAuthSession } from '../auth-session';

jest.mock('../auth-session', () => ({
  getAuthSession: jest.fn()
}));

const mockedGetAuthSession = jest.mocked(getAuthSession);

describe('api-client service', () => {
  afterEach(() => {
    mockedGetAuthSession.mockReset();
  });

  it('sets json content type by default', () => {
    expect(apiClient.defaults.headers).toBeDefined();
    expect(apiAuthClient.defaults.headers).toBeDefined();
  });

  it('adds bearer token in auth interceptor when session exists', async () => {
    mockedGetAuthSession.mockReturnValue({
      accessToken: 'token-123',
      user: {
        id: 'u1',
        firstName: 'Vlad',
        lastName: 'Sosnov',
        email: 'vlad@bakery.local',
        role: 'customer'
      }
    });

    const handlers = apiAuthClient.interceptors.request.handlers;
    const requestInterceptor = handlers?.[0]?.fulfilled;
    expect(requestInterceptor).toBeDefined();

    const config = await requestInterceptor?.({
      headers: {}
    } as InternalAxiosRequestConfig);

    expect(config?.headers.get('Authorization')).toBe('Bearer token-123');
  });

  it('removes bearer token in auth interceptor when session is missing', async () => {
    mockedGetAuthSession.mockReturnValue(null);

    const handlers = apiAuthClient.interceptors.request.handlers;
    const requestInterceptor = handlers?.[0]?.fulfilled;
    expect(requestInterceptor).toBeDefined();

    const config = await requestInterceptor?.({
      headers: {
        Authorization: 'Bearer old'
      }
    } as InternalAxiosRequestConfig);

    expect(config?.headers.get('Authorization')).toBeUndefined();
  });
});
