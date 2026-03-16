import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';

import { AUTH_STORAGE_KEY } from '@src/services/auth-session';
import { getMyOrders } from '@src/services/order-api';
import { saveProductReview } from '@src/services/product-api';
import { MyOrdersPage } from './MyOrdersPage';

jest.mock('@src/services/order-api', () => ({
  getMyOrders: jest.fn()
}));
jest.mock('@src/services/product-api', () => ({
  saveProductReview: jest.fn()
}));
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn()
  }
}));

const mockedGetMyOrders = jest.mocked(getMyOrders);
const mockedSaveProductReview = jest.mocked(saveProductReview);
const mockedToastSuccess = jest.mocked(toast.success);

describe('MyOrdersPage', () => {
  afterEach(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    mockedGetMyOrders.mockReset();
    mockedSaveProductReview.mockReset();
    mockedToastSuccess.mockReset();
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
          note: 'Please include extra napkins.',
          totalItems: 2,
          totalPrice: 16,
          createdAt: new Date().toISOString(),
          deliveryAddress: {
            zip: '10001',
            street: 'Main st 1',
            city: 'New York'
          },
          items: [
            {
              productId: 'p1',
              name: 'Sourdough loaf',
              price: 8,
              quantity: 2,
              lineTotal: 16,
              review: null
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

  it('submits a review for an order item', async () => {
    const user = userEvent.setup();

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
          note: '',
          totalItems: 1,
          totalPrice: 8,
          createdAt: new Date().toISOString(),
          deliveryAddress: {
            zip: '10001',
            street: 'Main st 1',
            city: 'New York'
          },
          items: [
            {
              productId: 'p1',
              name: 'Sourdough loaf',
              price: 8,
              quantity: 1,
              lineTotal: 8,
              review: null
            }
          ]
        }
      ]
    });
    mockedSaveProductReview.mockResolvedValue({
      data: {
        productId: 'p1',
        averageRating: 5,
        reviewCount: 1,
        review: {
          userId: 'customer-id',
          userName: 'Vlad Sosnov',
          rating: 5,
          comment: 'Excellent crumb.',
          updatedAt: '2026-01-01T10:00:00.000Z'
        }
      }
    });

    render(<MyOrdersPage />);

    await screen.findByText(/sourdough loaf x 1/i);
    await user.click(screen.getByRole('button', { name: /write review/i }));
    await user.selectOptions(screen.getByLabelText(/^rating$/i), '5');
    await user.type(screen.getByLabelText(/^comment$/i), 'Excellent crumb.');
    await user.click(screen.getByRole('button', { name: /save review/i }));

    expect(mockedSaveProductReview).toHaveBeenCalledWith('p1', {
      rating: 5,
      comment: 'Excellent crumb.'
    });
    expect(await screen.findByText(/rating: 5 \/ 5/i)).toBeInTheDocument();
    expect(screen.getByText(/excellent crumb\./i)).toBeInTheDocument();
    expect(mockedToastSuccess).toHaveBeenCalledWith('Review saved.');
  });
});
