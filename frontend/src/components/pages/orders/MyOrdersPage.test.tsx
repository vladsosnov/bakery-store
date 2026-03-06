import { render, screen } from '@testing-library/react';

import { AUTH_STORAGE_KEY } from '@src/services/auth-session';
import { getMyOrders } from '@src/services/order-api';
import { MyOrdersPage } from './MyOrdersPage';

jest.mock('@src/services/order-api', () => ({
  getMyOrders: jest.fn()
}));

const mockedGetMyOrders = jest.mocked(getMyOrders);

describe('MyOrdersPage', () => {
  afterEach(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    mockedGetMyOrders.mockReset();
  });

  it('asks guest user to sign in', () => {
    render(<MyOrdersPage />);

    expect(screen.getByRole('heading', { name: /my orders/i })).toBeInTheDocument();
    expect(screen.getByText(/please sign in to view your orders/i)).toBeInTheDocument();
  });

  it('renders orders for customer', async () => {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        accessToken: 'token',
        user: {
          id: 'customer-id',
          firstName: 'Vlad',
          lastName: 'Sosnov',
          email: 'vlad@bakery.local',
          role: 'customer'
        }
      })
    );
    mockedGetMyOrders.mockResolvedValue({
      data: [
        {
          id: 'order-id-123456',
          status: 'placed',
          totalItems: 2,
          totalPrice: 16,
          createdAt: new Date().toISOString(),
          items: [
            {
              productId: 'p1',
              name: 'Sourdough loaf',
              price: 8,
              quantity: 2,
              lineTotal: 16
            }
          ]
        }
      ]
    });

    render(<MyOrdersPage />);

    expect(await screen.findByText(/order #123456/i)).toBeInTheDocument();
    expect(screen.getByText(/sourdough loaf x 2/i)).toBeInTheDocument();
    expect(screen.getByText(/^placed$/i)).toBeInTheDocument();
  });
});
