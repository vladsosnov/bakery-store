import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { toast } from 'sonner';

import { changePasswordByEmail } from '@src/services/auth-api';
import { AUTH_STORAGE_KEY } from '@src/services/auth-session';
import { ChangePasswordPage } from '../ChangePasswordPage';

jest.mock('@src/services/auth-api', () => ({
  changePasswordByEmail: jest.fn()
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

const mockedChangePasswordByEmail = jest.mocked(changePasswordByEmail);
const mockedToastSuccess = jest.mocked(toast.success);
const mockedToastError = jest.mocked(toast.error);

describe('ChangePasswordPage', () => {
  afterEach(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    mockedChangePasswordByEmail.mockReset();
    mockedToastSuccess.mockReset();
    mockedToastError.mockReset();
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

  it('generates temporary password on success', async () => {
    const user = userEvent.setup();
    mockedChangePasswordByEmail.mockResolvedValue({
      data: {
        message: 'Temporary password generated.',
        temporaryPassword: 'temp-1234'
      }
    });

    render(
      <MemoryRouter>
        <ChangePasswordPage />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/email/i), 'vlad@bakery.local');
    await user.click(screen.getByRole('button', { name: /generate temporary password/i }));

    await waitFor(() => {
      expect(mockedChangePasswordByEmail).toHaveBeenCalledWith({ email: 'vlad@bakery.local' });
    });
    expect(mockedToastSuccess).toHaveBeenCalledWith('Temporary password generated.');
    expect(await screen.findByText('temp-1234')).toBeInTheDocument();
    expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /generate temporary password/i })).not.toBeInTheDocument();
  });

  it('shows error toast on failed request', async () => {
    const user = userEvent.setup();
    mockedChangePasswordByEmail.mockRejectedValue(new Error('network'));

    render(
      <MemoryRouter>
        <ChangePasswordPage />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/email/i), 'vlad@bakery.local');
    await user.click(screen.getByRole('button', { name: /generate temporary password/i }));

    await waitFor(() => {
      expect(mockedToastError).toHaveBeenCalledWith('Failed to change password. Please try again.');
    });
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
