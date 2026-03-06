import {
  AuthError,
  changePasswordByEmail,
  getMyProfile,
  loginUser,
  registerCustomer,
  seedAdminUser,
  setOwnPassword,
  updateMyProfile
} from '../src/services/auth.service.js';
import { UserModel } from '../src/models/user.model.js';
import { USER_ROLES } from '../src/types/user-role.js';
import { comparePassword, hashPassword } from '../src/utils/password.js';
import { signAccessToken } from '../src/utils/jwt.js';

jest.mock('../src/config/env.js', () => ({
  env: {
    ADMIN_EMAIL: 'admin@admin.com',
    ADMIN_PASSWORD: 'adminadmin',
    ADMIN_FIRST_NAME: 'Admin',
    ADMIN_LAST_NAME: 'User'
  }
}));

jest.mock('../src/models/user.model.js', () => ({
  UserModel: {
    findOne: jest.fn(),
    findById: jest.fn(),
    create: jest.fn()
  }
}));

jest.mock('../src/utils/password.js', () => ({
  hashPassword: jest.fn(),
  comparePassword: jest.fn()
}));

jest.mock('../src/utils/jwt.js', () => ({
  signAccessToken: jest.fn()
}));

describe('auth service business flows', () => {
  const findOneMock = UserModel.findOne as jest.MockedFunction<typeof UserModel.findOne>;
  const findByIdMock = UserModel.findById as jest.MockedFunction<typeof UserModel.findById>;
  const createMock = UserModel.create as jest.MockedFunction<typeof UserModel.create>;
  const hashPasswordMock = hashPassword as jest.MockedFunction<typeof hashPassword>;
  const comparePasswordMock = comparePassword as jest.MockedFunction<typeof comparePassword>;
  const signAccessTokenMock = signAccessToken as jest.MockedFunction<typeof signAccessToken>;

  beforeEach(() => {
    findOneMock.mockReset();
    findByIdMock.mockReset();
    createMock.mockReset();
    hashPasswordMock.mockReset();
    comparePasswordMock.mockReset();
    signAccessTokenMock.mockReset();
    signAccessTokenMock.mockReturnValue('token');
  });

  it('registers customer and returns auth payload', async () => {
    findOneMock.mockReturnValue({
      lean: jest.fn().mockResolvedValue(null)
    } as never);
    hashPasswordMock.mockResolvedValue('hashed-pass');
    createMock.mockResolvedValue({
      id: 'u1',
      firstName: 'Vlad',
      lastName: 'Sosnov',
      email: 'vlad@bakery.local',
      role: USER_ROLES.customer
    } as never);

    const result = await registerCustomer({
      firstName: 'Vlad',
      lastName: 'Sosnov',
      email: 'VLAD@BAKERY.LOCAL',
      password: 'password123'
    });

    expect(hashPasswordMock).toHaveBeenCalledWith('password123');
    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'vlad@bakery.local', role: USER_ROLES.customer })
    );
    expect(result.accessToken).toBe('token');
  });

  it('throws when registering with taken email', async () => {
    findOneMock.mockReturnValue({
      lean: jest.fn().mockResolvedValue({ id: 'existing' })
    } as never);

    await expect(
      registerCustomer({
        firstName: 'Vlad',
        lastName: 'Sosnov',
        email: 'vlad@bakery.local',
        password: 'password123'
      })
    ).rejects.toMatchObject({ code: 'EMAIL_TAKEN', statusCode: 409 });
  });

  it('logs in user and validates password', async () => {
    findOneMock.mockResolvedValue({
      id: 'u1',
      firstName: 'Vlad',
      lastName: 'Sosnov',
      email: 'vlad@bakery.local',
      role: USER_ROLES.customer,
      passwordHash: 'hash'
    } as never);
    comparePasswordMock.mockResolvedValue(true);

    const result = await loginUser({
      email: 'VLAD@BAKERY.LOCAL',
      password: 'password123'
    });

    expect(comparePasswordMock).toHaveBeenCalledWith('password123', 'hash');
    expect(result.accessToken).toBe('token');
  });

  it('throws for invalid login credentials', async () => {
    findOneMock.mockResolvedValue(null as never);
    await expect(loginUser({ email: 'x@x.com', password: '12345678' })).rejects.toMatchObject({
      code: 'INVALID_CREDENTIALS'
    });

    findOneMock.mockResolvedValue({
      passwordHash: 'hash'
    } as never);
    comparePasswordMock.mockResolvedValue(false);
    await expect(loginUser({ email: 'x@x.com', password: '12345678' })).rejects.toMatchObject({
      code: 'INVALID_CREDENTIALS'
    });
  });

  it('changes password by email and returns temporary password', async () => {
    const saveMock = jest.fn().mockResolvedValue(undefined);
    findOneMock.mockResolvedValue({
      passwordHash: 'old',
      save: saveMock
    } as never);
    hashPasswordMock.mockResolvedValue('temporary-hash');

    const result = await changePasswordByEmail({ email: 'vlad@bakery.local' });
    expect(result.temporaryPassword).toContain('Bakery-');
    expect(hashPasswordMock).toHaveBeenCalled();
    expect(saveMock).toHaveBeenCalledTimes(1);
  });

  it('sets own password', async () => {
    const saveMock = jest.fn().mockResolvedValue(undefined);
    findOneMock.mockResolvedValue({
      passwordHash: 'old-hash',
      save: saveMock
    } as never);
    comparePasswordMock.mockResolvedValue(true);
    hashPasswordMock.mockResolvedValue('new-hash');

    await expect(
      setOwnPassword({
        email: 'vlad@bakery.local',
        currentPassword: 'oldPassword123',
        newPassword: 'newPassword123'
      })
    ).resolves.toEqual({ message: 'Password updated successfully.' });
    expect(saveMock).toHaveBeenCalledTimes(1);
  });

  it('throws when setting password with invalid credentials', async () => {
    findOneMock.mockResolvedValue(null as never);
    await expect(
      setOwnPassword({
        email: 'missing@bakery.local',
        currentPassword: 'oldPassword123',
        newPassword: 'newPassword123'
      })
    ).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS' });

    findOneMock.mockResolvedValue({
      passwordHash: 'old-hash'
    } as never);
    comparePasswordMock.mockResolvedValue(false);
    await expect(
      setOwnPassword({
        email: 'vlad@bakery.local',
        currentPassword: 'wrongPassword123',
        newPassword: 'newPassword123'
      })
    ).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS' });
  });

  it('gets profile and handles missing user', async () => {
    findByIdMock.mockResolvedValue({
      id: 'u1',
      firstName: 'Vlad',
      lastName: 'Sosnov',
      email: 'vlad@bakery.local',
      role: USER_ROLES.customer,
      phoneNumber: '',
      address: null
    } as never);

    await expect(getMyProfile('u1')).resolves.toEqual(
      expect.objectContaining({
        id: 'u1',
        role: USER_ROLES.customer
      })
    );

    findByIdMock.mockResolvedValue(null as never);
    await expect(getMyProfile('missing')).rejects.toBeInstanceOf(AuthError);
  });

  it('updates customer profile and validates address requirement', async () => {
    const saveMock = jest.fn().mockResolvedValue(undefined);
    const user = {
      role: USER_ROLES.customer,
      firstName: 'Old',
      lastName: 'Name',
      phoneNumber: '',
      address: { zip: '', street: '', city: '' },
      save: saveMock
    };
    findByIdMock.mockResolvedValue(user as never);

    await expect(
      updateMyProfile('u1', {
        firstName: 'Vlad',
        lastName: 'Sosnov',
        phoneNumber: '+15550001122',
        address: { zip: '10001', street: '5th Avenue 10', city: 'New York' }
      })
    ).resolves.toEqual(expect.objectContaining({ firstName: 'Vlad', lastName: 'Sosnov' }));
    expect(saveMock).toHaveBeenCalledTimes(1);

    await expect(
      updateMyProfile('u1', {
        firstName: 'Vlad',
        lastName: 'Sosnov',
        phoneNumber: '',
        address: { zip: '', street: '', city: '' }
      })
    ).rejects.toMatchObject({ code: 'VALIDATION_ERROR', statusCode: 400 });
  });

  it('seeds admin user only when missing', async () => {
    findOneMock.mockReturnValue({
      lean: jest.fn().mockResolvedValueOnce({ id: 'admin-existing' })
    } as never);

    await seedAdminUser();
    expect(createMock).not.toHaveBeenCalled();

    findOneMock.mockReturnValue({
      lean: jest.fn().mockResolvedValueOnce(null)
    } as never);
    hashPasswordMock.mockResolvedValue('admin-hash');

    await seedAdminUser();
    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'admin@admin.com',
        role: USER_ROLES.admin
      })
    );
  });
});
