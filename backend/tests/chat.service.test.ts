import { Types } from 'mongoose';

import {
  ChatError,
  getCustomerThread,
  listThreadsForModeration,
  sendCustomerMessage,
  sendModeratorMessage
} from '../src/services/chat.service.js';
import { ChatThreadModel } from '../src/models/chat-thread.model.js';
import { UserModel } from '../src/models/user.model.js';
import { USER_ROLES } from '../src/types/user-role.js';

jest.mock('../src/models/chat-thread.model.js', () => ({
  ChatThreadModel: {
    findOne: jest.fn(),
    findById: jest.fn(),
    find: jest.fn()
  }
}));

jest.mock('../src/models/user.model.js', () => ({
  UserModel: {
    findById: jest.fn()
  }
}));

jest.mock('../src/sockets/chat.socket.js', () => ({
  emitChatThreadUpdated: jest.fn()
}));

describe('chat service', () => {
  const chatFindOneMock = ChatThreadModel.findOne as jest.MockedFunction<typeof ChatThreadModel.findOne>;
  const chatFindByIdMock = ChatThreadModel.findById as jest.MockedFunction<typeof ChatThreadModel.findById>;
  const chatFindMock = ChatThreadModel.find as jest.MockedFunction<typeof ChatThreadModel.find>;
  const userFindByIdMock = UserModel.findById as jest.MockedFunction<typeof UserModel.findById>;

  beforeEach(() => {
    chatFindOneMock.mockReset();
    chatFindByIdMock.mockReset();
    chatFindMock.mockReset();
    userFindByIdMock.mockReset();
  });

  it('loads customer thread', async () => {
    chatFindOneMock.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(null)
      })
    } as never);

    const result = await getCustomerThread('u1');
    expect(result).toBeNull();
  });

  it('throws for non-customer send', async () => {
    await expect(sendCustomerMessage('u1', USER_ROLES.moderator, 'hello')).rejects.toBeInstanceOf(ChatError);
  });

  it('lists threads for moderator/admin', async () => {
    chatFindMock.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue([])
        })
      })
    } as never);

    const result = await listThreadsForModeration(USER_ROLES.moderator);
    expect(result).toEqual([]);
  });

  it('throws moderator send on invalid thread id', async () => {
    await expect(sendModeratorMessage(USER_ROLES.moderator, 'm1', 'bad-id', 'reply')).rejects.toBeInstanceOf(
      ChatError
    );
  });

  it('throws moderator send when thread not found', async () => {
    chatFindByIdMock.mockResolvedValue(null as never);

    await expect(
      sendModeratorMessage(USER_ROLES.moderator, String(new Types.ObjectId()), String(new Types.ObjectId()), 'reply')
    ).rejects.toMatchObject({
      code: 'CHAT_THREAD_NOT_FOUND',
      statusCode: 404
    });
  });
});
