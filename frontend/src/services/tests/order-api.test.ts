import { getMyOrders, placeOrder } from '../order-api';
import { apiAuthClient } from '../api-client';

jest.mock('../api-client', () => ({
  apiAuthClient: {
    get: jest.fn(),
    post: jest.fn()
  }
}));

const mockedApiAuthClient = jest.mocked(apiAuthClient);

describe('order-api service', () => {
  afterEach(() => {
    mockedApiAuthClient.get.mockReset();
    mockedApiAuthClient.post.mockReset();
  });

  it('places order', async () => {
    mockedApiAuthClient.post.mockResolvedValue({ data: { data: { order: null, cart: null } } });

    await placeOrder();

    expect(mockedApiAuthClient.post).toHaveBeenCalledWith('/api/orders', { useProfileAddress: true });
  });

  it('places order with note', async () => {
    mockedApiAuthClient.post.mockResolvedValue({ data: { data: { order: null, cart: null } } });

    await placeOrder({ useProfileAddress: true, note: 'Please ring the bell.' });

    expect(mockedApiAuthClient.post).toHaveBeenCalledWith('/api/orders', {
      useProfileAddress: true,
      note: 'Please ring the bell.'
    });
  });

  it('loads my orders', async () => {
    mockedApiAuthClient.get.mockResolvedValue({ data: { data: [] } });

    await getMyOrders();

    expect(mockedApiAuthClient.get).toHaveBeenCalledWith('/api/orders');
  });
});
