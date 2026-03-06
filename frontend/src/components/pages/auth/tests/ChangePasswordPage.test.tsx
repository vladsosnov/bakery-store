import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { AUTH_STORAGE_KEY } from '@src/services/auth-session';
import { ChangePasswordPage } from '../ChangePasswordPage';

describe('ChangePasswordPage', () => {
  afterEach(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  });

  it('renders change-password form fields and action', () => {
    render(
      <MemoryRouter>
        <ChangePasswordPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /change password/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate temporary password/i })).toBeInTheDocument();
  });

  it('redirects authenticated user to profile page', () => {
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

    render(
      <MemoryRouter initialEntries={['/change-password']}>
        <Routes>
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/profile" element={<div>Profile page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Profile page')).toBeInTheDocument();
  });
});
