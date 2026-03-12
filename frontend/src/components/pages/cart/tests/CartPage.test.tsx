import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AUTH_STORAGE_KEY } from '@src/services/auth-session';
import { getMyProfile } from '@src/services/auth-api';
import { fetchCart, removeCartItem, updateCartItemQuantity } from '@src/services/cart-api';
import { placeOrder } from '@src/services/order-api';
import { CartPage } from '../CartPage';

jest.mock('@src/services/cart-api', () => ({
  fetchCart: jest.fn(),
  updateCartItemQuantity: jest.fn(),
  removeCartItem: jest.fn()
}));
jest.mock('@src/services/auth-api', () => ({
  getMyProfile: jest.fn()
}));

jest.mock('@src/services/order-api', () => ({
  placeOrder: jest.fn()
}));

const mockedFetchCart = jest.mocked(fetchCart);
const mockedGetMyProfile = jest.mocked(getMyProfile);
const mockedUpdateCartItemQuantity = jest.mocked(updateCartItemQuantity);
const mockedRemoveCartItem = jest.mocked(removeCartItem);
const mockedPlaceOrder = jest.mocked(placeOrder);

describe('CartPage', () => {
  afterEach(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    mockedFetchCart.mockReset();
    mockedGetMyProfile.mockReset();
    mockedUpdateCartItemQuantity.mockReset();
    mockedRemoveCartItem.mockReset();
    mockedPlaceOrder.mockReset();
    mockedGetMyProfile.mockResolvedValue({
      data: {
        id: 'u1',
        firstName: 'Vlad',
        lastName: 'Sosnov',
        email: 'vlad@bakery.local',
        role: 'customer',
        phoneNumber: '+123',
        address: {
          zip: '10001',
          street: 'Main st 1',
          city: 'New York'
        }
      }
    });
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
    expect(screen.getByRole('button', { name: /place order/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/order note/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/use address from profile/i)).toBeChecked();
  });

  it('shows custom delivery address fields when profile-address checkbox is unchecked', async () => {
    const user = userEvent.setup();
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
            quantity: 1,
            availableStock: 6,
            lineTotal: 8
          }
        ],
        totalItems: 1,
        totalPrice: 8
      }
    });

    render(<CartPage />);

    const checkbox = await screen.findByLabelText(/use address from profile/i);
    await user.click(checkbox);

    expect(screen.getByLabelText(/delivery zip/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/delivery city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/delivery street/i)).toBeInTheDocument();
  });

  it('places order from cart', async () => {
    const user = userEvent.setup();

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
            quantity: 1,
            availableStock: 6,
            lineTotal: 8
          }
        ],
        totalItems: 1,
        totalPrice: 8
      }
    });
    mockedPlaceOrder.mockResolvedValue({
      data: {
        order: {
          id: 'o1',
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
          items: []
        },
        cart: {
          items: [],
          totalItems: 0,
          totalPrice: 0
        }
      }
    });

    render(<CartPage />);

    await user.click(await screen.findByRole('button', { name: /place order/i }));
    expect(mockedPlaceOrder).toHaveBeenCalled();
  });

  it('shows restriction message for moderator users', () => {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        accessToken: 'token',
        user: {
          id: 'm1',
          firstName: 'Marta',
          lastName: 'Baker',
          email: 'marta@bakery.local',
          role: 'moderator'
        }
      })
    );

    render(<CartPage />);

    expect(screen.getByText(/as a moderator, you can not use cart or place orders/i)).toBeInTheDocument();
    expect(mockedFetchCart).not.toHaveBeenCalled();
  });
});
