import { act, renderHook, waitFor } from '@testing-library/react';
import { toast } from 'sonner';
import type { MouseEvent } from 'react';

import { useCart } from '@src/components/pages/cart/useCart';
import { getAuthSession } from '@src/services/auth-session';
import { fetchCart, removeCartItem, updateCartItemQuantity } from '@src/services/cart-api';
import { placeOrder } from '@src/services/order-api';
import type { CartResponse } from '@src/services/cart-api';

jest.mock('@src/services/auth-session', () => ({
  getAuthSession: jest.fn()
}));

jest.mock('@src/services/cart-api', () => ({
  fetchCart: jest.fn(),
  updateCartItemQuantity: jest.fn(),
  removeCartItem: jest.fn()
}));

jest.mock('@src/services/order-api', () => ({
  placeOrder: jest.fn()
}));

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn()
  }
}));

const mockedGetAuthSession = jest.mocked(getAuthSession);
const mockedFetchCart = jest.mocked(fetchCart);
const mockedUpdateCartItemQuantity = jest.mocked(updateCartItemQuantity);
const mockedRemoveCartItem = jest.mocked(removeCartItem);
const mockedPlaceOrder = jest.mocked(placeOrder);
const mockedToastError = jest.mocked(toast.error);
const mockedToastSuccess = jest.mocked(toast.success);

const authenticatedSession = {
  accessToken: 'token',
  user: {
    id: 'u1',
    firstName: 'Vlad',
    lastName: 'Sosnov',
    email: 'vlad@bakery.local',
    role: 'customer' as const
  }
};

const createItem = (quantity: number, lineTotal: number) => ({
  productId: 'p1',
  name: 'Sourdough loaf',
  imageUrl: 'https://example.com/sourdough.jpg',
  price: 8,
  quantity,
  availableStock: 6,
  lineTotal
});

const cartWithOneItem: CartResponse = {
  data: {
    items: [createItem(2, 16)],
    totalItems: 2,
    totalPrice: 16
  }
};

describe('useCart', () => {
  afterEach(() => {
    mockedGetAuthSession.mockReset();
    mockedFetchCart.mockReset();
    mockedUpdateCartItemQuantity.mockReset();
    mockedRemoveCartItem.mockReset();
    mockedPlaceOrder.mockReset();
    mockedToastError.mockReset();
    mockedToastSuccess.mockReset();
  });

  it('does not load cart for guest session', () => {
    mockedGetAuthSession.mockReturnValue(null);

    const { result } = renderHook(() => useCart());

    expect(result.current.session).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(mockedFetchCart).not.toHaveBeenCalled();
  });

  it('loads cart for authenticated user', async () => {
    mockedGetAuthSession.mockReturnValue(authenticatedSession);
    mockedFetchCart.mockResolvedValue(cartWithOneItem);

    const { result } = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.items).toEqual(cartWithOneItem.data.items);
    expect(result.current.totalPrice).toBe(16);
    expect(mockedFetchCart).toHaveBeenCalledTimes(1);
  });

  it('increases item quantity', async () => {
    mockedGetAuthSession.mockReturnValue(authenticatedSession);
    mockedFetchCart.mockResolvedValue(cartWithOneItem);
    mockedUpdateCartItemQuantity.mockResolvedValue({
      data: {
        items: [createItem(3, 24)],
        totalItems: 3,
        totalPrice: 24
      }
    });

    const { result } = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.handleIncreaseClick({
        currentTarget: { dataset: { productId: 'p1' } }
      } as unknown as MouseEvent<HTMLButtonElement>);
    });

    await waitFor(() => {
      expect(mockedUpdateCartItemQuantity).toHaveBeenCalledWith({
        productId: 'p1',
        quantity: 3
      });
    });
    await waitFor(() => {
      expect(result.current.items[0]?.quantity).toBe(3);
      expect(result.current.totalPrice).toBe(24);
    });
  });

  it('does not decrease below one', async () => {
    mockedGetAuthSession.mockReturnValue(authenticatedSession);
    mockedFetchCart.mockResolvedValue({
      data: {
        items: [createItem(1, 8)],
        totalItems: 1,
        totalPrice: 8
      }
    });

    const { result } = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.handleDecreaseClick({
        currentTarget: { dataset: { productId: 'p1' } }
      } as unknown as MouseEvent<HTMLButtonElement>);
    });

    expect(mockedUpdateCartItemQuantity).not.toHaveBeenCalled();
  });

  it('removes item from cart', async () => {
    mockedGetAuthSession.mockReturnValue(authenticatedSession);
    mockedFetchCart.mockResolvedValue(cartWithOneItem);
    mockedRemoveCartItem.mockResolvedValue({
      data: {
        items: [],
        totalItems: 0,
        totalPrice: 0
      }
    });

    const { result } = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.handleRemoveClick({
        currentTarget: { dataset: { productId: 'p1' } }
      } as unknown as MouseEvent<HTMLButtonElement>);
    });

    await waitFor(() => {
      expect(mockedRemoveCartItem).toHaveBeenCalledWith({ productId: 'p1' });
    });
    await waitFor(() => {
      expect(result.current.items).toEqual([]);
      expect(result.current.totalPrice).toBe(0);
    });
  });

  it('places order and clears cart', async () => {
    mockedGetAuthSession.mockReturnValue(authenticatedSession);
    mockedFetchCart.mockResolvedValue(cartWithOneItem);
    mockedPlaceOrder.mockResolvedValue({
      data: {
        order: {
          id: 'o1',
          status: 'placed',
          totalItems: 2,
          totalPrice: 16,
          createdAt: new Date().toISOString(),
          items: []
        },
        cart: {
          items: [],
          totalItems: 0,
          totalPrice: 0
        }
      }
    });

    const { result } = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.handlePlaceOrderClick();
    });

    await waitFor(() => {
      expect(mockedPlaceOrder).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(result.current.items).toEqual([]);
      expect(result.current.totalPrice).toBe(0);
      expect(mockedToastSuccess).toHaveBeenCalledWith('Order placed successfully.');
    });
  });
});
