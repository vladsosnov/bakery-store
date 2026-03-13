import {
  createAdminModerator,
  deleteAdminModerator,
  getAdminOrders,
  getAdminUsers,
  updateAdminModerator,
  updateAdminOrderStatus
} from '../admin-api';
import { apiAuthClient } from '../api-client';

jest.mock('../api-client', () => ({
  apiAuthClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn()
  }
}));

const mockedApiAuthClient = jest.mocked(apiAuthClient);

describe('admin-api service', () => {
  afterEach(() => {
    mockedApiAuthClient.get.mockReset();
    mockedApiAuthClient.post.mockReset();
    mockedApiAuthClient.patch.mockReset();
    mockedApiAuthClient.delete.mockReset();
  });

  it('loads users', async () => {
    mockedApiAuthClient.get.mockResolvedValue({ data: { data: [] } });

    await getAdminUsers();

    expect(mockedApiAuthClient.get).toHaveBeenCalledWith('/api/admin/users');
  });

  it('creates moderator', async () => {
    mockedApiAuthClient.post.mockResolvedValue({ data: { data: { id: 'm1' } } });

    await createAdminModerator({
      firstName: 'Marta',
      lastName: 'Baker',
      email: 'marta@bakery.local',
      password: 'password123'
    });

    expect(mockedApiAuthClient.post).toHaveBeenCalledWith('/api/admin/moderators', {
      firstName: 'Marta',
      lastName: 'Baker',
      email: 'marta@bakery.local',
      password: 'password123'
    });
  });

  it('updates moderator', async () => {
    mockedApiAuthClient.patch.mockResolvedValue({ data: { data: { id: 'm1' } } });

    await updateAdminModerator('m1', {
      firstName: 'Marta',
      isActive: true
    });

    expect(mockedApiAuthClient.patch).toHaveBeenCalledWith('/api/admin/moderators/m1', {
      firstName: 'Marta',
      isActive: true
    });
  });

  it('deletes moderator', async () => {
    mockedApiAuthClient.delete.mockResolvedValue({});

    await deleteAdminModerator('m1');

    expect(mockedApiAuthClient.delete).toHaveBeenCalledWith('/api/admin/moderators/m1');
  });

  it('loads orders', async () => {
    mockedApiAuthClient.get.mockResolvedValue({ data: { data: [] } });

    await getAdminOrders();

    expect(mockedApiAuthClient.get).toHaveBeenCalledWith('/api/admin/orders');
  });

  it('updates order status', async () => {
    mockedApiAuthClient.patch.mockResolvedValue({ data: { data: { id: 'o1', status: 'placed', note: '' } } });

    await updateAdminOrderStatus('o1', 'in progress', 'Status changed by moderator');

    expect(mockedApiAuthClient.patch).toHaveBeenCalledWith('/api/admin/orders/o1/status', {
      status: 'in progress',
      note: 'Status changed by moderator'
    });
  });
});
