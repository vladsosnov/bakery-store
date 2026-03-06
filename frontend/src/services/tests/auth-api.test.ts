import {
  changePasswordByEmail,
  getMyProfile,
  loginUser,
  registerUser,
  setOwnPassword,
  updateMyProfile
} from '../auth-api';
import { apiAuthClient, apiClient } from '../api-client';

jest.mock('../api-client', () => ({
  apiClient: {
    post: jest.fn()
  },
  apiAuthClient: {
    get: jest.fn(),
    patch: jest.fn()
  }
}));

const mockedApiClient = jest.mocked(apiClient);
const mockedApiAuthClient = jest.mocked(apiAuthClient);

describe('auth-api service', () => {
  afterEach(() => {
    mockedApiClient.post.mockReset();
    mockedApiAuthClient.get.mockReset();
    mockedApiAuthClient.patch.mockReset();
  });

  it('calls register endpoint', async () => {
    mockedApiClient.post.mockResolvedValue({ data: { data: { accessToken: 'token' } } });

    await registerUser({
      firstName: 'Vlad',
      lastName: 'Sosnov',
      email: 'vlad@bakery.local',
      password: 'password123'
    });

    expect(mockedApiClient.post).toHaveBeenCalledWith('/api/auth/register', {
      firstName: 'Vlad',
      lastName: 'Sosnov',
      email: 'vlad@bakery.local',
      password: 'password123'
    });
  });

  it('calls login endpoint', async () => {
    mockedApiClient.post.mockResolvedValue({ data: { data: { accessToken: 'token' } } });

    await loginUser({
      email: 'vlad@bakery.local',
      password: 'password123'
    });

    expect(mockedApiClient.post).toHaveBeenCalledWith('/api/auth/login', {
      email: 'vlad@bakery.local',
      password: 'password123'
    });
  });

  it('calls change-password endpoint', async () => {
    mockedApiClient.post.mockResolvedValue({ data: { data: { message: 'ok' } } });

    await changePasswordByEmail({ email: 'vlad@bakery.local' });

    expect(mockedApiClient.post).toHaveBeenCalledWith('/api/auth/change-password', {
      email: 'vlad@bakery.local'
    });
  });

  it('calls set-password endpoint', async () => {
    mockedApiClient.post.mockResolvedValue({ data: { data: { message: 'ok' } } });

    await setOwnPassword({
      email: 'vlad@bakery.local',
      currentPassword: 'old-password',
      newPassword: 'new-password'
    });

    expect(mockedApiClient.post).toHaveBeenCalledWith('/api/auth/set-password', {
      email: 'vlad@bakery.local',
      currentPassword: 'old-password',
      newPassword: 'new-password'
    });
  });

  it('calls get profile endpoint', async () => {
    mockedApiAuthClient.get.mockResolvedValue({ data: { data: { id: 'u1' } } });

    await getMyProfile();

    expect(mockedApiAuthClient.get).toHaveBeenCalledWith('/api/auth/me');
  });

  it('calls update profile endpoint', async () => {
    mockedApiAuthClient.patch.mockResolvedValue({ data: { data: { id: 'u1' } } });

    await updateMyProfile({
      firstName: 'Vlad',
      lastName: 'Sosnov'
    });

    expect(mockedApiAuthClient.patch).toHaveBeenCalledWith('/api/auth/profile', {
      firstName: 'Vlad',
      lastName: 'Sosnov'
    });
  });
});
