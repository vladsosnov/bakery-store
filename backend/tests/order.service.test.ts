import { Types } from 'mongoose';

import {
  ensureCustomerRole,
  listAllOrdersForDashboard,
  listMyOrders,
  OrderError,
  placeOrderFromCart,
  updateOrderStatusForDashboard
} from '../src/services/order.service.js';
import { CartModel } from '../src/models/cart.model.js';
import { OrderModel } from '../src/models/order.model.js';
import { ProductModel } from '../src/models/product.model.js';
import { UserModel } from '../src/models/user.model.js';
import { ORDER_STATUSES } from '../src/types/order-status.js';

jest.mock('../src/models/cart.model.js', () => ({
  CartModel: {
    findOne: jest.fn()
  }
}));

jest.mock('../src/models/order.model.js', () => ({
  OrderModel: {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn()
  }
}));

jest.mock('../src/models/product.model.js', () => ({
  ProductModel: {
    find: jest.fn()
  }
}));

jest.mock('../src/models/user.model.js', () => ({
  UserModel: {
    findById: jest.fn()
  }
}));

describe('order service business flows', () => {
  const cartFindOneMock = CartModel.findOne as jest.MockedFunction<typeof CartModel.findOne>;
  const orderCreateMock = OrderModel.create as jest.MockedFunction<typeof OrderModel.create>;
  const orderFindMock = OrderModel.find as jest.MockedFunction<typeof OrderModel.find>;
  const orderFindByIdMock = OrderModel.findById as jest.MockedFunction<typeof OrderModel.findById>;
  const productFindMock = ProductModel.find as jest.MockedFunction<typeof ProductModel.find>;
  const userFindByIdMock = UserModel.findById as jest.MockedFunction<typeof UserModel.findById>;

  beforeEach(() => {
    cartFindOneMock.mockReset();
    orderCreateMock.mockReset();
    orderFindMock.mockReset();
    orderFindByIdMock.mockReset();
    productFindMock.mockReset();
    userFindByIdMock.mockReset();
    userFindByIdMock.mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        address: {
          zip: '10001',
          street: '5th Avenue 10',
          city: 'New York'
        }
      })
    } as never);
  });

  it('throws EMPTY_CART when cart is missing', async () => {
    cartFindOneMock.mockResolvedValue(null as never);

    await expect(placeOrderFromCart('user-1')).rejects.toMatchObject({
      code: 'EMPTY_CART',
      statusCode: 400
    });
  });

  it('throws validation error for invalid place-order payload', async () => {
    cartFindOneMock.mockResolvedValue({
      items: [{ productId: new Types.ObjectId(), quantity: 1 }]
    } as never);

    await expect(placeOrderFromCart('user-1', { useProfileAddress: 'yes' })).rejects.toMatchObject({
      code: 'VALIDATION_ERROR',
      statusCode: 400
    });
  });

  it('throws when profile address is missing or user is not found', async () => {
    const productId = new Types.ObjectId();
    cartFindOneMock.mockResolvedValue({
      items: [{ productId, quantity: 1 }]
    } as never);

    userFindByIdMock.mockReturnValue({
      lean: jest.fn().mockResolvedValue(null)
    } as never);
    await expect(placeOrderFromCart('user-1')).rejects.toMatchObject({
      code: 'USER_NOT_FOUND',
      statusCode: 404
    });

    userFindByIdMock.mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        address: {
          zip: '',
          street: '5th Avenue 10',
          city: 'New York'
        }
      })
    } as never);
    await expect(placeOrderFromCart('user-1')).rejects.toMatchObject({
      code: 'PROFILE_ADDRESS_REQUIRED',
      statusCode: 400
    });
  });

  it('requires manual delivery address when profile address is disabled', async () => {
    const productId = new Types.ObjectId();
    cartFindOneMock.mockResolvedValue({
      items: [{ productId, quantity: 1 }]
    } as never);

    await expect(placeOrderFromCart('user-1', { useProfileAddress: false })).rejects.toMatchObject({
      code: 'VALIDATION_ERROR',
      statusCode: 400
    });
  });

  it('places order from cart and clears cart', async () => {
    const productId = new Types.ObjectId();
    const cartSave = jest.fn().mockResolvedValue(undefined);
    const productSave = jest.fn().mockResolvedValue(undefined);
    const cart = {
      items: [{ productId, quantity: 2 }],
      save: cartSave
    };
    const product = {
      _id: productId,
      name: 'Sourdough loaf',
      price: 8,
      stock: 5,
      isAvailable: true,
      save: productSave
    };

    cartFindOneMock.mockResolvedValue(cart as never);
    productFindMock.mockResolvedValue([product] as never);
    orderCreateMock.mockResolvedValue({
      id: 'order-1',
      status: ORDER_STATUSES.placed,
      totalItems: 2,
      totalPrice: 16,
      createdAt: new Date('2026-01-01T10:00:00.000Z'),
      items: [{ productId, name: 'Sourdough loaf', price: 8, quantity: 2, lineTotal: 16 }]
    } as never);

    const result = await placeOrderFromCart('user-1');

    expect(orderCreateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        status: ORDER_STATUSES.placed,
        totalItems: 2,
        totalPrice: 16,
        note: '',
        deliveryAddress: {
          zip: '10001',
          street: '5th Avenue 10',
          city: 'New York'
        }
      })
    );
    expect(product.stock).toBe(3);
    expect(productSave).toHaveBeenCalledTimes(1);
    expect(cartSave).toHaveBeenCalledTimes(1);
    expect(result.cart.totalItems).toBe(0);
    expect(result.order.totalItems).toBe(2);
  });

  it('places order with manual delivery address and marks product unavailable at zero stock', async () => {
    const productId = new Types.ObjectId();
    const cartSave = jest.fn().mockResolvedValue(undefined);
    const productSave = jest.fn().mockResolvedValue(undefined);
    const cart = {
      items: [{ productId, quantity: 2 }],
      save: cartSave
    };
    const product = {
      _id: productId,
      name: 'Butter croissant',
      price: 6,
      stock: 2,
      isAvailable: true,
      save: productSave
    };

    cartFindOneMock.mockResolvedValue(cart as never);
    productFindMock.mockResolvedValue([product] as never);
    orderCreateMock.mockResolvedValue({
      id: 'order-2',
      status: ORDER_STATUSES.placed,
      totalItems: 2,
      totalPrice: 12,
      createdAt: new Date('2026-01-01T10:00:00.000Z'),
      items: [{ productId, name: 'Butter croissant', price: 6, quantity: 2, lineTotal: 12 }],
      deliveryAddress: {
        zip: ' 10001 ',
        street: ' Main street 1 ',
        city: ' New York '
      }
    } as never);

    await placeOrderFromCart('user-1', {
      useProfileAddress: false,
      note: 'Leave at the side entrance.',
      deliveryAddress: {
        zip: ' 10001 ',
        street: ' Main street 1 ',
        city: ' New York '
      }
    });

    expect(orderCreateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        note: 'Leave at the side entrance.',
        deliveryAddress: {
          zip: '10001',
          street: 'Main street 1',
          city: 'New York'
        }
      })
    );
    expect(product.stock).toBe(0);
    expect(product.isAvailable).toBe(false);
    expect(productSave).toHaveBeenCalledTimes(1);
    expect(cartSave).toHaveBeenCalledTimes(1);
  });

  it('allows checkout when product exists but is hidden from shop', async () => {
    const productId = new Types.ObjectId();
    const cartSave = jest.fn().mockResolvedValue(undefined);
    const productSave = jest.fn().mockResolvedValue(undefined);
    cartFindOneMock.mockResolvedValue({
      items: [{ productId, quantity: 1 }],
      save: cartSave
    } as never);
    productFindMock.mockResolvedValue([
      {
        _id: productId,
        name: 'Hidden item',
        price: 9,
        isAvailable: false,
        stock: 10,
        save: productSave
      }
    ] as never);
    orderCreateMock.mockResolvedValue({
      id: 'order-hidden',
      status: ORDER_STATUSES.placed,
      totalItems: 1,
      totalPrice: 9,
      createdAt: new Date('2026-01-01T10:00:00.000Z'),
      items: [{ productId, name: 'Hidden item', price: 9, quantity: 1, lineTotal: 9 }]
    } as never);

    await expect(placeOrderFromCart('user-1')).resolves.toMatchObject({
      order: {
        totalItems: 1
      }
    });
  });

  it('throws PRODUCT_UNAVAILABLE when product is missing in DB response', async () => {
    const productId = new Types.ObjectId();
    cartFindOneMock.mockResolvedValue({
      items: [{ productId, quantity: 1 }]
    } as never);
    productFindMock.mockResolvedValue([] as never);

    await expect(placeOrderFromCart('user-1')).rejects.toMatchObject({
      code: 'PRODUCT_UNAVAILABLE',
      statusCode: 409
    });
  });

  it('throws VALIDATION_ERROR when note is longer than 500 characters', async () => {
    const productId = new Types.ObjectId();
    cartFindOneMock.mockResolvedValue({
      items: [{ productId, quantity: 1 }]
    } as never);

    await expect(
      placeOrderFromCart('user-1', {
        useProfileAddress: true,
        note: 'x'.repeat(501)
      })
    ).rejects.toMatchObject({
      code: 'VALIDATION_ERROR',
      statusCode: 400
    });
  });

  it('throws OUT_OF_STOCK when quantity exceeds stock', async () => {
    const productId = new Types.ObjectId();
    cartFindOneMock.mockResolvedValue({
      items: [{ productId, quantity: 5 }]
    } as never);
    productFindMock.mockResolvedValue([
      {
        _id: productId,
        name: 'Sourdough loaf',
        isAvailable: true,
        stock: 2
      }
    ] as never);

    await expect(placeOrderFromCart('user-1')).rejects.toMatchObject({
      code: 'OUT_OF_STOCK',
      statusCode: 409
    });
  });

  it('lists my orders', async () => {
    const productId = new Types.ObjectId();
    orderFindMock.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue([
          {
            _id: new Types.ObjectId(),
            status: ORDER_STATUSES.placed,
            totalItems: 1,
            totalPrice: 8,
            createdAt: new Date('2026-01-01T10:00:00.000Z'),
            items: [{ productId, name: 'Sourdough loaf', price: 8, quantity: 1, lineTotal: 8 }]
          }
        ])
      })
    } as never);

    const result = await listMyOrders('user-1');
    expect(result).toHaveLength(1);
    expect(result[0]?.status).toBe(ORDER_STATUSES.placed);
  });

  it('lists all orders for dashboard with user details', async () => {
    const productId = new Types.ObjectId();
    const userId = new Types.ObjectId();

    orderFindMock.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue([
            {
              _id: new Types.ObjectId(),
              userId: {
                _id: userId,
                email: 'john@bakery.local',
                firstName: 'John',
                lastName: 'Doe',
                phoneNumber: '+15550001122',
                address: { zip: '10001', street: '5th Avenue 10', city: 'New York' }
              },
              status: ORDER_STATUSES.inProgress,
              totalItems: 1,
              totalPrice: 8,
              createdAt: new Date('2026-01-01T10:00:00.000Z'),
              items: [{ productId, name: 'Sourdough loaf', quantity: 1, lineTotal: 8 }]
            }
          ])
        })
      })
    } as never);

    const result = await listAllOrdersForDashboard();
    expect(result).toHaveLength(1);
    expect(result[0]?.customerEmail).toBe('john@bakery.local');
    expect(result[0]?.deliveryAddress.city).toBe('New York');
  });

  it('updates order status with note and validates transitions', async () => {
    const orderSave = jest.fn().mockResolvedValue(undefined);
    orderFindByIdMock.mockResolvedValue({
      id: 'order-1',
      status: ORDER_STATUSES.placed,
      note: '',
      save: orderSave
    } as never);

    const updated = await updateOrderStatusForDashboard(String(new Types.ObjectId()), {
      status: ORDER_STATUSES.inProgress,
      note: 'Preparing your order now.'
    });
    expect(updated.status).toBe(ORDER_STATUSES.inProgress);
    expect(updated.note).toBe('Preparing your order now.');
    expect(orderSave).toHaveBeenCalledTimes(1);

    orderFindByIdMock.mockResolvedValue({
      id: 'order-2',
      status: ORDER_STATUSES.inDelivery,
      note: '',
      save: jest.fn()
    } as never);
    await expect(
      updateOrderStatusForDashboard(String(new Types.ObjectId()), { status: ORDER_STATUSES.placed })
    ).rejects.toMatchObject({
      code: 'ORDER_STATUS_TRANSITION_FORBIDDEN',
      statusCode: 409
    });
  });

  it('allows cancellation from in-progress state', async () => {
    const saveMock = jest.fn().mockResolvedValue(undefined);
    orderFindByIdMock.mockResolvedValue({
      id: 'order-3',
      status: ORDER_STATUSES.inProgress,
      note: '',
      save: saveMock
    } as never);

    const updated = await updateOrderStatusForDashboard(String(new Types.ObjectId()), {
      status: ORDER_STATUSES.canceled,
      note: 'Item unavailable today.'
    });

    expect(updated.status).toBe(ORDER_STATUSES.canceled);
    expect(updated.note).toBe('Item unavailable today.');
    expect(saveMock).toHaveBeenCalledTimes(1);
  });

  it('throws on invalid status payload and missing order', async () => {
    await expect(
      updateOrderStatusForDashboard(String(new Types.ObjectId()), { status: 'not-valid' })
    ).rejects.toBeInstanceOf(OrderError);

    await expect(
      updateOrderStatusForDashboard(String(new Types.ObjectId()), {
        status: ORDER_STATUSES.inProgress,
        note: 'x'.repeat(501)
      })
    ).rejects.toBeInstanceOf(OrderError);

    orderFindByIdMock.mockResolvedValue(null as never);
    await expect(
      updateOrderStatusForDashboard(String(new Types.ObjectId()), { status: ORDER_STATUSES.placed })
    ).rejects.toMatchObject({
      code: 'ORDER_NOT_FOUND',
      statusCode: 404
    });
  });

  it('validates customer role', async () => {
    userFindByIdMock.mockReturnValue({
      lean: jest.fn().mockResolvedValue({ role: 'customer' })
    } as never);
    await expect(ensureCustomerRole('user-1')).resolves.toBeUndefined();

    userFindByIdMock.mockReturnValue({
      lean: jest.fn().mockResolvedValue({ role: 'moderator' })
    } as never);
    await expect(ensureCustomerRole('user-2')).rejects.toMatchObject({
      code: 'FORBIDDEN',
      statusCode: 403
    });

    userFindByIdMock.mockReturnValue({
      lean: jest.fn().mockResolvedValue(null)
    } as never);
    await expect(ensureCustomerRole('user-3')).rejects.toMatchObject({
      code: 'USER_NOT_FOUND',
      statusCode: 404
    });
  });
});
