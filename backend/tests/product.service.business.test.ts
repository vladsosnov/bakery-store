import { Types } from 'mongoose';

import {
  createOrUpdateProductReview,
  createProduct,
  deleteProduct,
  listProductReviews,
  listProducts,
  listProductsForAdmin,
  updateProduct
} from '../src/services/product.service.js';
import { OrderModel } from '../src/models/order.model.js';
import { ProductModel } from '../src/models/product.model.js';
import { UserModel } from '../src/models/user.model.js';

jest.mock('../src/models/product.model.js', () => ({
  ProductModel: {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn()
  }
}));

jest.mock('../src/models/order.model.js', () => ({
  OrderModel: {
    findOne: jest.fn()
  }
}));

jest.mock('../src/models/user.model.js', () => ({
  UserModel: {
    findById: jest.fn()
  }
}));

describe('product service business flows', () => {
  const createMock = ProductModel.create as jest.MockedFunction<typeof ProductModel.create>;
  const findMock = ProductModel.find as jest.MockedFunction<typeof ProductModel.find>;
  const findOneMock = ProductModel.findOne as jest.MockedFunction<typeof ProductModel.findOne>;
  const findByIdMock = ProductModel.findById as jest.MockedFunction<typeof ProductModel.findById>;
  const findByIdAndDeleteMock = ProductModel.findByIdAndDelete as jest.MockedFunction<typeof ProductModel.findByIdAndDelete>;
  const orderFindOneMock = OrderModel.findOne as jest.MockedFunction<typeof OrderModel.findOne>;
  const userFindByIdMock = UserModel.findById as jest.MockedFunction<typeof UserModel.findById>;

  beforeEach(() => {
    createMock.mockReset();
    findMock.mockReset();
    findOneMock.mockReset();
    findByIdMock.mockReset();
    findByIdAndDeleteMock.mockReset();
    orderFindOneMock.mockReset();
    userFindByIdMock.mockReset();
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
      reviews: [],
      averageRating: 0,
      reviewCount: 0,
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

  it('creates a review for a purchased product and updates aggregates', async () => {
    const productId = '507f1f77bcf86cd799439011';
    const userId = '507f191e810c19729de860ea';
    const saveMock = jest.fn().mockResolvedValue(undefined);
    const product = {
      id: productId,
      reviews: [],
      averageRating: 0,
      reviewCount: 0,
      save: saveMock
    };

    findByIdMock.mockResolvedValue(product as never);
    userFindByIdMock.mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        firstName: 'Vlad',
        lastName: 'Sosnov',
        email: 'vlad@bakery.local'
      })
    } as never);
    orderFindOneMock.mockReturnValue({
      select: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue({ _id: 'order-1' })
      })
    } as never);

    const result = await createOrUpdateProductReview(productId, userId, {
      rating: 5,
      comment: 'Excellent crumb.'
    });

    expect(saveMock).toHaveBeenCalledTimes(1);
    expect(product.reviewCount).toBe(1);
    expect(product.averageRating).toBe(5);
    expect(result).toEqual(
      expect.objectContaining({
        productId,
        averageRating: 5,
        reviewCount: 1,
        review: expect.objectContaining({
          userId,
          rating: 5,
          comment: 'Excellent crumb.'
        })
      })
    );
  });

  it('updates an existing review instead of creating a duplicate', async () => {
    const productId = '507f1f77bcf86cd799439011';
    const userId = '507f191e810c19729de860ea';
    const existingReview = {
      userId: new Types.ObjectId(userId),
      userName: 'Vlad Sosnov',
      rating: 3,
      comment: 'Good',
      updatedAt: new Date('2026-01-01T10:00:00.000Z')
    };
    const product = {
      id: productId,
      reviews: [existingReview],
      averageRating: 3,
      reviewCount: 1,
      save: jest.fn().mockResolvedValue(undefined)
    };

    findByIdMock.mockResolvedValue(product as never);
    userFindByIdMock.mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        firstName: 'Vlad',
        lastName: 'Sosnov',
        email: 'vlad@bakery.local'
      })
    } as never);
    orderFindOneMock.mockReturnValue({
      select: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue({ _id: 'order-1' })
      })
    } as never);

    await createOrUpdateProductReview(productId, userId, {
      rating: 4,
      comment: 'Much better on the second try.'
    });

    expect(product.reviews).toHaveLength(1);
    expect(existingReview.rating).toBe(4);
    expect(existingReview.comment).toBe('Much better on the second try.');
    expect(product.averageRating).toBe(4);
  });

  it('rejects review creation when order is not delivered', async () => {
    const productId = '507f1f77bcf86cd799439011';
    const userId = '507f191e810c19729de860ea';

    findByIdMock.mockResolvedValue({
      id: productId,
      reviews: [],
      averageRating: 0,
      reviewCount: 0,
      save: jest.fn()
    } as never);
    userFindByIdMock.mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        firstName: 'Vlad',
        lastName: 'Sosnov',
        email: 'vlad@bakery.local'
      })
    } as never);
    orderFindOneMock.mockReturnValue({
      select: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(null)
      })
    } as never);

    await expect(createOrUpdateProductReview(productId, userId, { rating: 5 })).rejects.toMatchObject({
      code: 'REVIEW_NOT_ALLOWED',
      statusCode: 403
    });
  });

  it('lists reviews sorted by updatedAt descending', async () => {
    const productId = '507f1f77bcf86cd799439011';
    findByIdMock.mockReturnValue({
      select: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue({
          reviews: [
            {
              userId: new Types.ObjectId('507f191e810c19729de860ea'),
              userName: 'Anna Baker',
              rating: 4,
              comment: 'Very good.',
              updatedAt: new Date('2026-01-02T10:00:00.000Z')
            },
            {
              userId: new Types.ObjectId('507f191e810c19729de860eb'),
              userName: 'John Dough',
              rating: 5,
              comment: 'Excellent.',
              updatedAt: new Date('2026-01-03T10:00:00.000Z')
            }
          ]
        })
      })
    } as never);

    const result = await listProductReviews(productId);

    expect(result.map((review) => review.userName)).toEqual(['John Dough', 'Anna Baker']);
  });
});
