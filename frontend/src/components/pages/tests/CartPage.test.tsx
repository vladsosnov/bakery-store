import { render, screen } from '@testing-library/react';

import { AUTH_STORAGE_KEY } from '@src/services/auth-session';
import { fetchCart, removeCartItem, updateCartItemQuantity } from '@src/services/cart-api';
import { CartPage } from '../CartPage';

jest.mock('@src/services/cart-api', () => ({
  fetchCart: jest.fn(),
  updateCartItemQuantity: jest.fn(),
  removeCartItem: jest.fn()
}));

const mockedFetchCart = jest.mocked(fetchCart);
const mockedUpdateCartItemQuantity = jest.mocked(updateCartItemQuantity);
const mockedRemoveCartItem = jest.mocked(removeCartItem);

describe('CartPage', () => {
  afterEach(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    mockedFetchCart.mockReset();
    mockedUpdateCartItemQuantity.mockReset();
    mockedRemoveCartItem.mockReset();
  });

  it('asks guest to sign in', () => {
    render(<CartPage />);

    expect(screen.getByRole('heading', { name: /cart/i })).toBeInTheDocument();
    expect(screen.getByText(/please sign in to access your cart/i)).toBeInTheDocument();
  });

  it('shows cart content for authenticated user', async () => {
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
    mockedFetchCart.mockResolvedValue({
      data: {
        items: [],
        totalItems: 0,
        totalPrice: 0
      }
    });

    render(<CartPage />);

    expect(await screen.findByText(/hi vlad, your cart is empty for now/i)).toBeInTheDocument();
  });

  it('renders quantity and remove controls for cart items', async () => {
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
    mockedFetchCart.mockResolvedValue({
      data: {
        items: [
          {
            productId: 'p1',
            name: 'Sourdough loaf',
            imageUrl: 'https://example.com/sourdough.jpg',
            price: 8,
            quantity: 2,
            availableStock: 6,
            lineTotal: 16
          }
        ],
        totalItems: 2,
        totalPrice: 16
      }
    });

    render(<CartPage />);

    expect(await screen.findByText(/sourdough loaf/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /decrease quantity/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /increase quantity/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();
  });
});
