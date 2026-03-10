import { createProduct, deleteProduct, listProducts, listProductsForAdmin, updateProduct } from '../src/services/product.service.js';
import { ProductModel } from '../src/models/product.model.js';

jest.mock('../src/models/product.model.js', () => ({
  ProductModel: {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn()
  }
}));

describe('product service business flows', () => {
  const createMock = ProductModel.create as jest.MockedFunction<typeof ProductModel.create>;
  const findMock = ProductModel.find as jest.MockedFunction<typeof ProductModel.find>;
  const findOneMock = ProductModel.findOne as jest.MockedFunction<typeof ProductModel.findOne>;
  const findByIdMock = ProductModel.findById as jest.MockedFunction<typeof ProductModel.findById>;
  const findByIdAndDeleteMock = ProductModel.findByIdAndDelete as jest.MockedFunction<typeof ProductModel.findByIdAndDelete>;

  beforeEach(() => {
    createMock.mockReset();
    findMock.mockReset();
    findOneMock.mockReset();
    findByIdMock.mockReset();
    findByIdAndDeleteMock.mockReset();
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

  it('lists all products for admin without availability filter', async () => {
    findMock.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue([])
      })
    } as never);

    await listProductsForAdmin();
    expect(findMock).toHaveBeenCalledWith();
  });

  it('creates product with generated slug', async () => {
    findOneMock.mockReturnValue({
      select: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(null)
      })
    } as never);
    createMock.mockResolvedValue({
      toObject: () => ({ _id: 'p1', name: 'Sourdough loaf', slug: 'sourdough-loaf' })
    } as never);

    const result = await createProduct({
      name: 'Sourdough loaf',
      description: 'Naturally fermented bread.',
      category: 'Bread',
      price: 8,
      imageUrl: 'https://example.com/sourdough.jpg',
      tags: ['Bread'],
      isAvailable: true,
      stock: 5
    });

    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: 'sourdough-loaf'
      })
    );
    expect(result).toEqual(expect.objectContaining({ slug: 'sourdough-loaf' }));
  });

  it('updates product fields', async () => {
    const saveMock = jest.fn().mockResolvedValue(undefined);
    findByIdMock.mockResolvedValue({
      id: '507f1f77bcf86cd799439011',
      name: 'Old name',
      slug: 'old-name',
      description: 'Old description',
      category: 'Bread',
      price: 5,
      imageUrl: 'https://example.com/old.jpg',
      tags: ['Old'],
      isAvailable: true,
      stock: 1,
      save: saveMock,
      toObject: () => ({ _id: '507f1f77bcf86cd799439011', name: 'New name', slug: 'new-name' })
    } as never);
    findOneMock.mockReturnValue({
      select: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(null)
      })
    } as never);

    const result = await updateProduct('507f1f77bcf86cd799439011', {
      name: 'New name',
      price: 10
    });

    expect(saveMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expect.objectContaining({ name: 'New name' }));
  });

  it('deletes product', async () => {
    findByIdAndDeleteMock.mockResolvedValue({ id: '507f1f77bcf86cd799439011' } as never);

    await deleteProduct('507f1f77bcf86cd799439011');
    expect(findByIdAndDeleteMock).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
  });
});
