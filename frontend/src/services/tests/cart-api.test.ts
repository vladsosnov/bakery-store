import { addToCart, fetchCart, removeCartItem, updateCartItemQuantity } from '../cart-api';
import { apiAuthClient } from '../api-client';

jest.mock('../api-client', () => ({
  apiAuthClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn()
  }
}));

const mockedApiAuthClient = jest.mocked(apiAuthClient);

describe('cart-api service', () => {
  afterEach(() => {
    mockedApiAuthClient.get.mockReset();
    mockedApiAuthClient.post.mockReset();
    mockedApiAuthClient.patch.mockReset();
    mockedApiAuthClient.delete.mockReset();
  });

  it('loads cart', async () => {
    mockedApiAuthClient.get.mockResolvedValue({ data: { data: { items: [] } } });

    await fetchCart();

    expect(mockedApiAuthClient.get).toHaveBeenCalledWith('/api/cart');
  });

  it('adds item to cart', async () => {
    mockedApiAuthClient.post.mockResolvedValue({ data: { data: { items: [] } } });

    await addToCart({ productId: 'p1', quantity: 2 });

    expect(mockedApiAuthClient.post).toHaveBeenCalledWith('/api/cart/items', {
      productId: 'p1',
      quantity: 2
    });
  });

  it('updates item quantity', async () => {
    mockedApiAuthClient.patch.mockResolvedValue({ data: { data: { items: [] } } });

    await updateCartItemQuantity({ productId: 'p1', quantity: 3 });

    expect(mockedApiAuthClient.patch).toHaveBeenCalledWith('/api/cart/items/p1', {
      quantity: 3
    });
  });

  it('removes cart item', async () => {
    mockedApiAuthClient.delete.mockResolvedValue({ data: { data: { items: [] } } });

    await removeCartItem({ productId: 'p1' });

    expect(mockedApiAuthClient.delete).toHaveBeenCalledWith('/api/cart/items/p1');
  });
});
