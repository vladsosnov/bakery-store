import { listProducts, seedProductsCatalog } from '../src/services/product.service.js';
import { ProductModel } from '../src/models/product.model.js';

jest.mock('../src/models/product.model.js', () => ({
  ProductModel: {
    bulkWrite: jest.fn(),
    find: jest.fn()
  }
}));

describe('product service business flows', () => {
  const bulkWriteMock = ProductModel.bulkWrite as jest.MockedFunction<typeof ProductModel.bulkWrite>;
  const findMock = ProductModel.find as jest.MockedFunction<typeof ProductModel.find>;

  beforeEach(() => {
    bulkWriteMock.mockReset();
    findMock.mockReset();
  });

  it('seeds product catalog with bulk operations', async () => {
    bulkWriteMock.mockResolvedValue({} as never);

    await seedProductsCatalog();
    expect(bulkWriteMock).toHaveBeenCalledTimes(1);
    const operations = bulkWriteMock.mock.calls[0]?.[0] as Array<unknown>;
    expect(Array.isArray(operations)).toBe(true);
    expect(operations.length).toBeGreaterThan(0);
  });

  it('lists products with default filters', async () => {
    findMock.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue([])
      })
    } as never);

    await listProducts({});
    expect(findMock).toHaveBeenCalledWith({ isAvailable: true });
  });

  it('lists products with category, tag and search filters', async () => {
    findMock.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue([])
      })
    } as never);

    await listProducts({
      category: 'Bread',
      tag: 'New',
      search: 'sourdough'
    });

    expect(findMock).toHaveBeenCalledWith(
      expect.objectContaining({
        isAvailable: true,
        category: 'Bread',
        tags: 'New',
        $or: expect.any(Array)
      })
    );
  });
});
