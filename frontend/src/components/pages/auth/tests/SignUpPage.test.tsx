import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'sonner';

import { ROUTES } from '@src/app/routes';
import { registerUser } from '@src/services/auth-api';
import { setAuthSession } from '@src/services/auth-session';
import { SignUpPage } from '../SignUpPage';

const mockNavigate = jest.fn();

jest.mock('@src/services/auth-api', () => ({
  registerUser: jest.fn()
}));

jest.mock('@src/services/auth-session', () => ({
  setAuthSession: jest.fn()
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

const mockedRegisterUser = jest.mocked(registerUser);
const mockedSetAuthSession = jest.mocked(setAuthSession);
const mockedToastSuccess = jest.mocked(toast.success);
const mockedToastError = jest.mocked(toast.error);

describe('SignUpPage', () => {
  afterEach(() => {
    mockedRegisterUser.mockReset();
    mockedSetAuthSession.mockReset();
    mockedToastSuccess.mockReset();
    mockedToastError.mockReset();
    mockNavigate.mockReset();
  });

  it('renders sign-up form fields and action', () => {
    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('registers user and navigates home', async () => {
    const user = userEvent.setup();

    mockedRegisterUser.mockResolvedValue({
      data: {
        accessToken: 'token',
        user: {
          id: 'u1',
          firstName: 'Vlad',
          lastName: 'Sosnov',
          email: 'vlad@bakery.local',
          role: 'customer'
        }
      }
    });

    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/first name/i), 'Vlad');
    await user.type(screen.getByLabelText(/last name/i), 'Sosnov');
    await user.type(screen.getByLabelText(/email/i), 'vlad@bakery.local');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(mockedRegisterUser).toHaveBeenCalledWith({
        firstName: 'Vlad',
        lastName: 'Sosnov',
        email: 'vlad@bakery.local',
        password: 'password123'
      });
    });
    expect(mockedSetAuthSession).toHaveBeenCalledWith({
      accessToken: 'token',
      user: {
        id: 'u1',
        firstName: 'Vlad',
        lastName: 'Sosnov',
        email: 'vlad@bakery.local',
        role: 'customer'
      }
    });
    expect(mockedToastSuccess).toHaveBeenCalledWith('Welcome, Vlad! Your account is ready.');
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.home);
  });

  it('shows error toast on failed sign-up', async () => {
    const user = userEvent.setup();
    mockedRegisterUser.mockRejectedValue(new Error('network'));

    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/first name/i), 'Vlad');
    await user.type(screen.getByLabelText(/last name/i), 'Sosnov');
    await user.type(screen.getByLabelText(/email/i), 'vlad@bakery.local');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(mockedToastError).toHaveBeenCalledWith('Failed to create account. Please try again.');
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
