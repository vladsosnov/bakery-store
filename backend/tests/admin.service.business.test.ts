import { Types } from 'mongoose';

import {
  AdminError,
  createModerator,
  listAllOrders,
  listAllUsers,
  removeModerator,
  updateModerator,
  updateOrderStatus
} from '../src/services/admin.service.js';
import { UserModel } from '../src/models/user.model.js';
import { hashPassword } from '../src/utils/password.js';
import { USER_ROLES } from '../src/types/user-role.js';
import { listAllOrdersForDashboard, updateOrderStatusForDashboard } from '../src/services/order.service.js';

jest.mock('../src/models/user.model.js', () => ({
  UserModel: {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn()
  }
}));

jest.mock('../src/utils/password.js', () => ({
  hashPassword: jest.fn()
}));

jest.mock('../src/services/order.service.js', () => ({
  listAllOrdersForDashboard: jest.fn(),
  updateOrderStatusForDashboard: jest.fn()
}));

describe('admin service business flows', () => {
  const findMock = UserModel.find as jest.MockedFunction<typeof UserModel.find>;
  const findOneMock = UserModel.findOne as jest.MockedFunction<typeof UserModel.findOne>;
  const createMock = UserModel.create as jest.MockedFunction<typeof UserModel.create>;
  const findByIdMock = UserModel.findById as jest.MockedFunction<typeof UserModel.findById>;
  const hashPasswordMock = hashPassword as jest.MockedFunction<typeof hashPassword>;
  const listAllOrdersMock = listAllOrdersForDashboard as jest.MockedFunction<typeof listAllOrdersForDashboard>;
  const updateOrderStatusMock = updateOrderStatusForDashboard as jest.MockedFunction<
    typeof updateOrderStatusForDashboard
  >;

  beforeEach(() => {
    findMock.mockReset();
    findOneMock.mockReset();
    createMock.mockReset();
    findByIdMock.mockReset();
    hashPasswordMock.mockReset();
    listAllOrdersMock.mockReset();
    updateOrderStatusMock.mockReset();
  });

  it('lists all users', async () => {
    const createdAt = new Date('2026-01-01T10:00:00.000Z');
    const updatedAt = new Date('2026-01-02T10:00:00.000Z');
    findMock.mockReturnValue({
      select: jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([
          {
            _id: new Types.ObjectId(),
            firstName: 'Marta',
            lastName: 'Baker',
            email: 'marta@bakery.local',
            role: USER_ROLES.moderator,
            isActive: true,
            createdAt,
            updatedAt
          }
        ])
      })
    } as never);

    const result = await listAllUsers();
    expect(result).toHaveLength(1);
    expect(result[0]?.email).toBe('marta@bakery.local');
    expect(result[0]?.createdAt).toBe(createdAt.toISOString());
  });

  it('creates moderator and normalizes email', async () => {
    findOneMock.mockReturnValue({
      lean: jest.fn().mockResolvedValue(null)
    } as never);
    hashPasswordMock.mockResolvedValue('hashed-password');
    createMock.mockResolvedValue({
      id: 'mod-1',
      firstName: 'Marta',
      lastName: 'Baker',
      email: 'marta@bakery.local',
      role: USER_ROLES.moderator,
      isActive: true,
      createdAt: new Date('2026-01-01T10:00:00.000Z'),
      updatedAt: new Date('2026-01-01T10:00:00.000Z')
    } as never);

    const result = await createModerator({
      firstName: 'Marta',
      lastName: 'Baker',
      email: 'MARTA@BAKERY.LOCAL',
      password: 'moderator123'
    });

    expect(hashPasswordMock).toHaveBeenCalledWith('moderator123');
    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'marta@bakery.local',
        role: USER_ROLES.moderator
      })
    );
    expect(result.email).toBe('marta@bakery.local');
  });

  it('throws when creating moderator with taken email', async () => {
    findOneMock.mockReturnValue({
      lean: jest.fn().mockResolvedValue({ _id: new Types.ObjectId() })
    } as never);

    await expect(
      createModerator({
        firstName: 'Marta',
        lastName: 'Baker',
        email: 'marta@bakery.local',
        password: 'moderator123'
      })
    ).rejects.toMatchObject({
      code: 'EMAIL_TAKEN',
      statusCode: 409
    });
  });

  it('updates moderator profile', async () => {
    const saveMock = jest.fn().mockResolvedValue(undefined);
    findByIdMock.mockResolvedValue({
      id: 'mod-1',
      role: USER_ROLES.moderator,
      firstName: 'Old',
      lastName: 'Name',
      email: 'old@bakery.local',
      isActive: true,
      createdAt: new Date('2026-01-01T10:00:00.000Z'),
      updatedAt: new Date('2026-01-01T10:00:00.000Z'),
      save: saveMock
    } as never);
    findOneMock.mockReturnValue({
      lean: jest.fn().mockResolvedValue(null)
    } as never);

    const result = await updateModerator('mod-1', {
      firstName: 'Marta',
      lastName: 'Baker',
      email: 'MARTA@BAKERY.LOCAL',
      isActive: false
    });

    expect(saveMock).toHaveBeenCalledTimes(1);
    expect(result.firstName).toBe('Marta');
    expect(result.email).toBe('marta@bakery.local');
    expect(result.isActive).toBe(false);
  });

  it('throws when updating moderator not found', async () => {
    findByIdMock.mockResolvedValue(null as never);

    await expect(updateModerator('missing', { firstName: 'Marta' })).rejects.toMatchObject({
      code: 'MODERATOR_NOT_FOUND',
      statusCode: 404
    });
  });

  it('throws when updating moderator with taken email', async () => {
    findByIdMock.mockResolvedValue({
      id: 'mod-1',
      role: USER_ROLES.moderator,
      save: jest.fn()
    } as never);
    findOneMock.mockReturnValue({
      lean: jest.fn().mockResolvedValue({ _id: new Types.ObjectId() })
    } as never);

    await expect(updateModerator('mod-1', { email: 'used@bakery.local' })).rejects.toMatchObject({
      code: 'EMAIL_TAKEN',
      statusCode: 409
    });
  });

  it('removes moderator', async () => {
    const deleteOneMock = jest.fn().mockResolvedValue(undefined);
    findByIdMock.mockResolvedValue({
      role: USER_ROLES.moderator,
      deleteOne: deleteOneMock
    } as never);

    await removeModerator('mod-1');
    expect(deleteOneMock).toHaveBeenCalledTimes(1);
  });

  it('throws when removing moderator not found', async () => {
    findByIdMock.mockResolvedValue(null as never);
    await expect(removeModerator('missing')).rejects.toBeInstanceOf(AdminError);
  });

  it('delegates listing and updating order status', async () => {
    listAllOrdersMock.mockResolvedValue([{ id: 'order-1' }] as never);
    updateOrderStatusMock.mockResolvedValue({ id: 'order-1', status: 'in progress' } as never);

    await expect(listAllOrders()).resolves.toEqual([{ id: 'order-1' }]);
    await expect(updateOrderStatus('order-1', { status: 'in progress' })).resolves.toEqual({
      id: 'order-1',
      status: 'in progress'
    });
  });
});
