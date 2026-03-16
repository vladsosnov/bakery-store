import { getProductReviews, listProducts, saveProductReview } from '../product-api';
import { apiAuthClient, apiClient } from '../api-client';

jest.mock('../api-client', () => ({
  apiClient: {
    get: jest.fn()
  },
  apiAuthClient: {
    post: jest.fn()
  }
}));

const mockedApiClient = jest.mocked(apiClient);
const mockedApiAuthClient = jest.mocked(apiAuthClient);

describe('product-api service', () => {
  afterEach(() => {
    mockedApiClient.get.mockReset();
    mockedApiAuthClient.post.mockReset();
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

  it('saves product review', async () => {
    mockedApiAuthClient.post.mockResolvedValue({
      data: {
        data: {
          productId: 'p1',
          averageRating: 5,
          reviewCount: 1,
          review: { userId: 'u1', userName: 'Vlad', rating: 5, comment: 'Great', updatedAt: '2026-01-01T10:00:00.000Z' }
        }
      }
    });

    await saveProductReview('p1', { rating: 5, comment: 'Great' });

    expect(mockedApiAuthClient.post).toHaveBeenCalledWith('/api/products/p1/reviews', {
      rating: 5,
      comment: 'Great'
    });
  });

  it('loads product reviews', async () => {
    mockedApiClient.get.mockResolvedValue({
      data: {
        data: [{ userId: 'u1', userName: 'Vlad', rating: 5, comment: 'Great', updatedAt: '2026-01-01T10:00:00.000Z' }]
      }
    });

    await getProductReviews('p1');

    expect(mockedApiClient.get).toHaveBeenCalledWith('/api/products/p1/reviews');
  });
});
