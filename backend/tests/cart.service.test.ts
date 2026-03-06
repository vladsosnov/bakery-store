import {
  addItemToCart,
  CartError,
  getCart,
  parseAddCartItemInput,
  parseUpdateCartItemQuantityInput,
  removeCartItem,
  updateCartItemQuantity
} from '../src/services/cart.service.js';
import { CartModel } from '../src/models/cart.model.js';
import { ProductModel } from '../src/models/product.model.js';
import { Types } from 'mongoose';

jest.mock('../src/models/cart.model.js', () => ({
  CartModel: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn()
  }
}));

jest.mock('../src/models/product.model.js', () => ({
  ProductModel: {
    find: jest.fn(),
    findOne: jest.fn()
  }
}));

describe('parseAddCartItemInput', () => {
  it('accepts payload with productId and quantity', () => {
    const parsed = parseAddCartItemInput({
      productId: '67cc3987ec8b91b8ef6fc9ea',
      quantity: 2
    });

    expect(parsed).toEqual({
      productId: '67cc3987ec8b91b8ef6fc9ea',
      quantity: 2
    });
  });

  it('defaults quantity to 1', () => {
    const parsed = parseAddCartItemInput({
      productId: '67cc3987ec8b91b8ef6fc9ea'
    });

    expect(parsed).toEqual({
      productId: '67cc3987ec8b91b8ef6fc9ea',
      quantity: 1
    });
  });

  it('throws CartError for invalid payload', () => {
    expect(() =>
      parseAddCartItemInput({
        productId: '',
        quantity: 0
      })
    ).toThrow(CartError);
  });
});

describe('parseUpdateCartItemQuantityInput', () => {
  it('accepts payload with quantity', () => {
    const parsed = parseUpdateCartItemQuantityInput({
      quantity: 3
    });

    expect(parsed).toEqual({
      quantity: 3
    });
  });

  it('throws CartError for invalid payload', () => {
    expect(() =>
      parseUpdateCartItemQuantityInput({
        quantity: 0
      })
    ).toThrow(CartError);
  });
});

describe('cart service business flows', () => {
  const findOneMock = CartModel.findOne as jest.MockedFunction<typeof CartModel.findOne>;
  const findOneAndUpdateMock = CartModel.findOneAndUpdate as jest.MockedFunction<typeof CartModel.findOneAndUpdate>;
  const productFindMock = ProductModel.find as jest.MockedFunction<typeof ProductModel.find>;
  const productFindOneMock = ProductModel.findOne as jest.MockedFunction<typeof ProductModel.findOne>;

  beforeEach(() => {
    findOneMock.mockReset();
    findOneAndUpdateMock.mockReset();
    productFindMock.mockReset();
    productFindOneMock.mockReset();
  });

  it('returns empty cart when user has no cart', async () => {
    findOneMock.mockReturnValue({
      lean: jest.fn().mockResolvedValue(null)
    } as never);

    await expect(getCart('user-1')).resolves.toEqual({
      items: [],
      totalItems: 0,
      totalPrice: 0
    });
  });

  it('adds item to cart and returns resolved cart view', async () => {
    const productId = new Types.ObjectId();
    const userId = 'user-1';
    const cartSave = jest.fn().mockResolvedValue(undefined);
    const cart = {
      items: [],
      save: cartSave
    };

    productFindOneMock.mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        _id: productId,
        name: 'Sourdough loaf',
        imageUrl: 'https://example.com/sourdough.jpg',
        price: 8,
        stock: 6,
        isAvailable: true
      })
    } as never);
    findOneAndUpdateMock.mockResolvedValue(cart as never);
    productFindMock.mockReturnValue({
      lean: jest.fn().mockResolvedValue([
        {
          _id: productId,
          name: 'Sourdough loaf',
          imageUrl: 'https://example.com/sourdough.jpg',
          price: 8,
          stock: 6
        }
      ])
    } as never);

    const result = await addItemToCart(userId, { productId: String(productId), quantity: 2 });

    expect(cartSave).toHaveBeenCalledTimes(1);
    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.quantity).toBe(2);
    expect(result.totalItems).toBe(2);
    expect(result.totalPrice).toBe(16);
  });

  it('throws out of stock error when add exceeds stock', async () => {
    const productId = new Types.ObjectId();
    const cart = {
      items: [{ productId, quantity: 2 }],
      save: jest.fn()
    };

    productFindOneMock.mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        _id: productId,
        name: 'Sourdough loaf',
        imageUrl: 'https://example.com/sourdough.jpg',
        price: 8,
        stock: 2,
        isAvailable: true
      })
    } as never);
    findOneAndUpdateMock.mockResolvedValue(cart as never);

    await expect(addItemToCart('user-1', { productId: String(productId), quantity: 1 })).rejects.toMatchObject({
      code: 'OUT_OF_STOCK',
      statusCode: 409
    });
  });

  it('updates item quantity in cart', async () => {
    const productId = new Types.ObjectId();
    const cartSave = jest.fn().mockResolvedValue(undefined);
    const cart = {
      items: [{ productId, quantity: 1 }],
      save: cartSave
    };

    productFindOneMock.mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        _id: productId,
        name: 'Sourdough loaf',
        imageUrl: 'https://example.com/sourdough.jpg',
        price: 8,
        stock: 6,
        isAvailable: true
      })
    } as never);
    findOneMock.mockResolvedValue(cart as never);
    productFindMock.mockReturnValue({
      lean: jest.fn().mockResolvedValue([
        {
          _id: productId,
          name: 'Sourdough loaf',
          imageUrl: 'https://example.com/sourdough.jpg',
          price: 8,
          stock: 6
        }
      ])
    } as never);

    const result = await updateCartItemQuantity('user-1', String(productId), { quantity: 3 });

    expect(cartSave).toHaveBeenCalledTimes(1);
    expect(result.items[0]?.quantity).toBe(3);
    expect(result.totalPrice).toBe(24);
  });

  it('throws when updating quantity for missing cart item', async () => {
    const productId = new Types.ObjectId();

    productFindOneMock.mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        _id: productId,
        name: 'Sourdough loaf',
        imageUrl: 'https://example.com/sourdough.jpg',
        price: 8,
        stock: 6,
        isAvailable: true
      })
    } as never);
    findOneMock.mockResolvedValue({ items: [] } as never);

    await expect(updateCartItemQuantity('user-1', String(productId), { quantity: 2 })).rejects.toMatchObject({
      code: 'CART_ITEM_NOT_FOUND',
      statusCode: 404
    });
  });

  it('removes item from cart and returns empty cart if cart missing', async () => {
    findOneMock.mockResolvedValue(null as never);

    await expect(removeCartItem('user-1', String(new Types.ObjectId()))).resolves.toEqual({
      items: [],
      totalItems: 0,
      totalPrice: 0
    });
  });
});
