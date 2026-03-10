import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { toast } from 'sonner';

import { AUTH_STORAGE_KEY } from '@src/services/auth-session';
import * as adminApi from '@src/services/admin-api';
import * as chatApi from '@src/services/chat-api';
import { AdminDashboardPage } from './AdminDashboardPage';

jest.mock('@src/services/admin-api', () => ({
  getAdminUsers: jest.fn().mockResolvedValue({ data: [] }),
  getAdminOrders: jest.fn().mockResolvedValue({ data: [] }),
  getAdminProducts: jest.fn().mockResolvedValue({ data: [] }),
  createAdminModerator: jest.fn(),
  updateAdminModerator: jest.fn(),
  deleteAdminModerator: jest.fn(),
  createAdminProduct: jest.fn(),
  updateAdminProduct: jest.fn(),
  deleteAdminProduct: jest.fn(),
  ORDER_STATUS_OPTIONS: ['placed', 'in progress', 'in delivery'],
  updateAdminOrderStatus: jest.fn()
}));
jest.mock('@src/services/chat-api', () => ({
  getModeratorChatThreads: jest.fn().mockResolvedValue({ data: [] }),
  getModeratorChatThread: jest.fn(),
  postModeratorChatMessage: jest.fn()
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

describe('AdminDashboardPage', () => {
  const getAdminUsersMock = adminApi.getAdminUsers as jest.MockedFunction<typeof adminApi.getAdminUsers>;
  const getAdminOrdersMock = adminApi.getAdminOrders as jest.MockedFunction<typeof adminApi.getAdminOrders>;
  const updateAdminOrderStatusMock = adminApi.updateAdminOrderStatus as jest.MockedFunction<
    typeof adminApi.updateAdminOrderStatus
  >;
  const createAdminProductMock = adminApi.createAdminProduct as jest.MockedFunction<
    typeof adminApi.createAdminProduct
  >;
  const getModeratorChatThreadsMock = chatApi.getModeratorChatThreads as jest.MockedFunction<
    typeof chatApi.getModeratorChatThreads
  >;
  const toastErrorMock = jest.mocked(toast.error);

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
    createAdminProductMock.mockReset();
    createAdminProductMock.mockResolvedValue({
      data: {
        _id: 'product-1',
        name: 'Sourdough loaf',
        slug: 'sourdough-loaf',
        description: 'Fresh sourdough',
        category: 'Bread',
        price: 8,
        imageUrl: 'https://example.com/sourdough.jpg',
        tags: ['Bread'],
        isAvailable: true,
        stock: 5
      }
    });
    getModeratorChatThreadsMock.mockReset();
    getModeratorChatThreadsMock.mockResolvedValue({ data: [] });
    toastErrorMock.mockReset();

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

  it('redirects to sign in when session is missing', () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/sign-in" element={<div>Sign in page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Sign in page')).toBeInTheDocument();
  });

  it('redirects customer to home page', () => {
    setSession('customer');

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/" element={<div>Home page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Home page')).toBeInTheDocument();
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

  it('shows orders and chats tabs for moderator', async () => {
    setSession('moderator');

    render(
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>
    );

    expect(await screen.findByRole('button', { name: /all orders/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /chats/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /shop/i })).toBeInTheDocument();
    expect(screen.getByText(/inspect customer orders and answer customer chats\./i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /all users/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /log usage/i })).not.toBeInTheDocument();
  });

  it('creates product from shop tab', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>
    );

    await user.click(await screen.findByRole('button', { name: /shop/i }));
    await user.type(screen.getByLabelText(/^name$/i), 'Sourdough loaf');
    await user.type(screen.getByLabelText(/^category$/i), 'Bread');
    await user.type(screen.getByLabelText(/^price$/i), '8');
    await user.type(screen.getByLabelText(/^stock$/i), '5');
    await user.type(screen.getByLabelText(/image url/i), 'https://example.com/sourdough.jpg');
    await user.type(screen.getByLabelText(/description/i), 'Fresh sourdough');

    await user.click(screen.getByRole('button', { name: /add product/i }));

    await waitFor(() => {
      expect(createAdminProductMock).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Sourdough loaf',
          category: 'Bread'
        })
      );
    });
  });

  it('opens logs tab for admin', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>
    );

    await user.click(await screen.findByRole('button', { name: /log usage/i }));
    expect(await screen.findByText(/orders activity \(last 7 days\)/i)).toBeInTheDocument();
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
    expect(within(statusSelect).getByRole('option', { name: 'placed' })).toBeInTheDocument();
    await user.selectOptions(statusSelect, 'in progress');

    expect(updateAdminOrderStatusMock).toHaveBeenCalledWith('order-1', 'in progress');
  });

  it('does not allow rollback status options for progressed orders', async () => {
    const user = userEvent.setup();
    getAdminOrdersMock.mockResolvedValue({
      data: [
        {
          id: 'order-2',
          customerName: 'Anna Doe',
          customerEmail: 'anna@bakery.local',
          customerPhone: '+15550009999',
          status: 'in progress',
          totalItems: 1,
          totalPrice: 10,
          createdAt: new Date().toISOString(),
          items: [],
          deliveryAddress: {
            zip: '10001',
            street: '5th Avenue 10',
            city: 'New York'
          }
        }
      ]
    });

    render(
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>
    );

    await user.click(await screen.findByRole('button', { name: /all orders/i }));
    const statusSelect = await screen.findByRole('combobox', {
      name: /order status for anna@bakery.local/i
    });

    expect(statusSelect).toHaveDisplayValue('in progress');
    expect(within(statusSelect).queryByRole('option', { name: 'placed' })).not.toBeInTheDocument();
    expect(within(statusSelect).getByRole('option', { name: 'in progress' })).toBeInTheDocument();
    expect(within(statusSelect).getByRole('option', { name: 'in delivery' })).toBeInTheDocument();
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
    expect(screen.getByRole('heading', { name: /active orders/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /in delivery/i })).toBeInTheDocument();
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

  it('shows no-match text when filters exclude all orders', async () => {
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
        }
      ]
    });

    render(
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>
    );

    await user.click(await screen.findByRole('button', { name: /all orders/i }));
    await user.type(screen.getByRole('searchbox', { name: /search orders/i }), 'not-existing-user');

    expect(await screen.findByText(/no orders match current filters\./i)).toBeInTheDocument();
  });

  it('shows toast on dashboard load failure', async () => {
    getAdminUsersMock.mockRejectedValueOnce(new Error('network'));

    render(
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith('Failed to load admin dashboard.');
    });
  });

  it('shows toast on order status update failure', async () => {
    const user = userEvent.setup();

    getAdminOrdersMock.mockResolvedValue({
      data: [
        {
          id: 'order-1',
          customerName: 'John Doe',
          customerEmail: 'customer@bakery.local',
          customerPhone: '+15550001122',
          status: 'placed',
          totalItems: 1,
          totalPrice: 6,
          createdAt: new Date().toISOString(),
          items: [],
          deliveryAddress: { zip: '10001', street: '5th Avenue 10', city: 'New York' }
        }
      ]
    });
    updateAdminOrderStatusMock.mockRejectedValueOnce(new Error('network'));

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

    expect(toastErrorMock).toHaveBeenCalledWith('Failed to update order status.');
  });

  it('closes create modal on Escape key', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /create moderator/i }));
    expect(screen.getByRole('dialog', { name: /create moderator dialog/i })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: /create moderator dialog/i })).not.toBeInTheDocument();
  });
});
