import { render, screen } from '@testing-library/react';

import { AUTH_STORAGE_KEY } from '@src/services/auth-session';
import { ProfilePage } from '../ProfilePage';

describe('ProfilePage', () => {
  afterEach(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  });

  it('shows profile data when user is authenticated', () => {
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

    render(<ProfilePage />);

    expect(screen.getByRole('heading', { name: /profile/i })).toBeInTheDocument();
    expect(screen.getByText('Vlad')).toBeInTheDocument();
    expect(screen.getByText('Sosnov')).toBeInTheDocument();
    expect(screen.getByText('vlad@bakery.local')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /reset password/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate temporary password/i })).toBeInTheDocument();
  });
});
