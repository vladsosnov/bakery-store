import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { AUTH_STORAGE_KEY } from '@src/services/auth-session';
import * as adminApi from '@src/services/admin-api';
import { AdminDashboardPage } from '../AdminDashboardPage';

jest.mock('@src/services/admin-api', () => ({
  getAdminUsers: jest.fn().mockResolvedValue({ data: [] }),
  getAdminOrders: jest.fn().mockResolvedValue({ data: [] }),
  createAdminModerator: jest.fn(),
  updateAdminModerator: jest.fn(),
  deleteAdminModerator: jest.fn()
}));

describe('AdminDashboardPage', () => {
  const getAdminUsersMock = adminApi.getAdminUsers as jest.MockedFunction<typeof adminApi.getAdminUsers>;
  const getAdminOrdersMock = adminApi.getAdminOrders as jest.MockedFunction<typeof adminApi.getAdminOrders>;

  const setSession = (role: 'admin' | 'moderator' | 'customer') => {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        accessToken: 'token',
        user: {
          id: `${role}-id`,
          firstName: role === 'admin' ? 'Admin' : role === 'moderator' ? 'Moderator' : 'Customer',
          lastName: 'User',
          email: `${role}@admin.com`,
          role
        }
      })
    );
  };

  beforeEach(() => {
    getAdminUsersMock.mockResolvedValue({
      data: [
        {
          id: 'moderator-1',
          firstName: 'Marta',
          lastName: 'Baker',
          email: 'marta@bakery.com',
          role: 'moderator',
          isActive: true,
          createdAt: null,
          updatedAt: null
        }
      ]
    });
    getAdminOrdersMock.mockResolvedValue({ data: [] });

    setSession('admin');
  });

  afterEach(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  });

  it('opens create moderator modal from button click', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /create moderator/i }));
    expect(screen.getByRole('dialog', { name: /create moderator dialog/i })).toBeInTheDocument();
  });

  it('opens edit moderator modal when clicking edit', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>
    );

    await user.click(await screen.findByRole('button', { name: /^edit$/i }));
    expect(screen.getByRole('dialog', { name: /edit moderator dialog/i })).toBeInTheDocument();
  });

  it('opens remove moderator confirmation modal when clicking remove', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>
    );

    await user.click(await screen.findByRole('button', { name: /^remove$/i }));
    expect(
      screen.getByRole('dialog', { name: /remove moderator confirmation dialog/i })
    ).toBeInTheDocument();
  });

  it('shows only orders tab for moderator', async () => {
    setSession('moderator');

    render(
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>
    );

    expect(await screen.findByRole('button', { name: /all orders/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /all users/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /log usage/i })).not.toBeInTheDocument();
  });
});
