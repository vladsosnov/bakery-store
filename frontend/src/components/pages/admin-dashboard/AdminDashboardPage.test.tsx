import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { AUTH_STORAGE_KEY } from '@src/services/auth-session';
import * as adminApi from '@src/services/admin-api';
import { AdminDashboardPage } from './AdminDashboardPage';

jest.mock('@src/services/admin-api', () => ({
  getAdminUsers: jest.fn().mockResolvedValue({ data: [] }),
  getAdminOrders: jest.fn().mockResolvedValue({ data: [] }),
  createAdminModerator: jest.fn(),
  updateAdminModerator: jest.fn(),
  deleteAdminModerator: jest.fn(),
  ORDER_STATUS_OPTIONS: ['placed', 'in progress', 'in delivery'],
  updateAdminOrderStatus: jest.fn()
}));

describe('AdminDashboardPage', () => {
  const getAdminUsersMock = adminApi.getAdminUsers as jest.MockedFunction<typeof adminApi.getAdminUsers>;
  const getAdminOrdersMock = adminApi.getAdminOrders as jest.MockedFunction<typeof adminApi.getAdminOrders>;
  const updateAdminOrderStatusMock = adminApi.updateAdminOrderStatus as jest.MockedFunction<
    typeof adminApi.updateAdminOrderStatus
  >;

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
    updateAdminOrderStatusMock.mockReset();

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

  it('updates order status from orders tab', async () => {
    const user = userEvent.setup();

    getAdminOrdersMock.mockResolvedValue({
      data: [
        {
          id: 'order-1',
          customerName: 'John Doe',
          customerEmail: 'customer@bakery.local',
          customerPhone: '+15550001122',
          status: 'placed',
          totalItems: 2,
          totalPrice: 12,
          createdAt: new Date().toISOString(),
          items: [
            {
              productId: 'p1',
              name: 'Sourdough loaf',
              quantity: 2,
              lineTotal: 12
            }
          ],
          deliveryAddress: {
            zip: '10001',
            street: '5th Avenue 10',
            city: 'New York'
          }
        }
      ]
    });
    updateAdminOrderStatusMock.mockResolvedValue({
      data: {
        id: 'order-1',
        status: 'in progress'
      }
    });

    render(
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>
    );

    await user.click(await screen.findByRole('button', { name: /all orders/i }));
    const statusSelect = await screen.findByRole('combobox', {
      name: /order status for customer@bakery.local/i
    });
    await user.selectOptions(statusSelect, 'in progress');

    expect(updateAdminOrderStatusMock).toHaveBeenCalledWith('order-1', 'in progress');
  });

  it('filters by status and searches by customer or order number', async () => {
    const user = userEvent.setup();

    getAdminOrdersMock.mockResolvedValue({
      data: [
        {
          id: 'order-123456',
          customerName: 'John Doe',
          customerEmail: 'john@bakery.local',
          customerPhone: '+15550001122',
          status: 'placed',
          totalItems: 2,
          totalPrice: 12,
          createdAt: new Date().toISOString(),
          items: [],
          deliveryAddress: { zip: '10001', street: '5th Avenue 10', city: 'New York' }
        },
        {
          id: 'order-654321',
          customerName: 'Anna Smith',
          customerEmail: 'anna@bakery.local',
          customerPhone: '+15550003344',
          status: 'in delivery',
          totalItems: 1,
          totalPrice: 9,
          createdAt: new Date().toISOString(),
          items: [],
          deliveryAddress: { zip: '20001', street: 'Main Street 1', city: 'Washington' }
        }
      ]
    });

    render(
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>
    );

    await user.click(await screen.findByRole('button', { name: /all orders/i }));
    expect(await screen.findByText(/john doe/i)).toBeInTheDocument();
    expect(screen.getByText(/anna smith/i)).toBeInTheDocument();

    await user.selectOptions(screen.getByRole('combobox', { name: /filter orders by status/i }), 'in delivery');
    expect(screen.queryByText(/john doe/i)).not.toBeInTheDocument();
    expect(screen.getByText(/anna smith/i)).toBeInTheDocument();

    await user.selectOptions(screen.getByRole('combobox', { name: /filter orders by status/i }), 'all');
    await user.type(screen.getByRole('searchbox', { name: /search orders/i }), '123456');
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    expect(screen.queryByText(/anna smith/i)).not.toBeInTheDocument();
  });
});
