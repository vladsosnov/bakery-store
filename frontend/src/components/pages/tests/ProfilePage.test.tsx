import { render, screen } from '@testing-library/react';

import { getMyProfile } from '@src/services/auth-api';
import { AUTH_STORAGE_KEY } from '@src/services/auth-session';
import { ProfilePage } from '../ProfilePage';

jest.mock('@src/services/auth-api', () => ({
  getMyProfile: jest.fn(),
  updateMyProfile: jest.fn(),
  changePasswordByEmail: jest.fn(),
  setOwnPassword: jest.fn()
}));

const mockedGetMyProfile = jest.mocked(getMyProfile);

describe('ProfilePage', () => {
  afterEach(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    mockedGetMyProfile.mockReset();
  });

  it('shows profile data when user is authenticated', async () => {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        accessToken: 'token',
        user: {
          id: 'u1',
          firstName: 'Vlad',
          lastName: 'Sosnov',
          email: 'vlad@bakery.local',
          role: 'customer'
        }
      })
    );
    mockedGetMyProfile.mockResolvedValue({
      data: {
        id: 'u1',
        firstName: 'Vlad',
        lastName: 'Sosnov',
        email: 'vlad@bakery.local',
        role: 'customer',
        phoneNumber: '+15550001122',
        address: {
          zip: '10001',
          street: '5th Avenue 10',
          city: 'New York'
        }
      }
    });

    render(<ProfilePage />);

    expect(await screen.findByRole('heading', { name: /profile/i })).toBeInTheDocument();
    expect(await screen.findByDisplayValue('Vlad')).toBeInTheDocument();
    expect(await screen.findByDisplayValue('Sosnov')).toBeInTheDocument();
    expect(screen.getByText('vlad@bakery.local')).toBeInTheDocument();
    expect(screen.queryByText(/^Role$/i)).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /personal info/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /reset password/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate temporary password/i })).toBeInTheDocument();
  });
});
