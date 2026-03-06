import { listProducts } from '../product-api';
import { apiClient } from '../api-client';

jest.mock('../api-client', () => ({
  apiClient: {
    get: jest.fn()
  }
}));

const mockedApiClient = jest.mocked(apiClient);

describe('product-api service', () => {
  afterEach(() => {
    mockedApiClient.get.mockReset();
  });

  it('loads product list from products endpoint', async () => {
    mockedApiClient.get.mockResolvedValue({
      data: {
        data: [
          {
            _id: 'p1',
            name: 'Sourdough loaf'
          }
        ]
      }
    });

    const response = await listProducts();

    expect(mockedApiClient.get).toHaveBeenCalledWith('/api/products');
    expect(response).toEqual([
      {
        _id: 'p1',
        name: 'Sourdough loaf'
      }
    ]);
  });
});
