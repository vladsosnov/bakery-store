import { Types } from 'mongoose';

import {
  ChatError,
  getCustomerThread,
  getThreadByIdForModeration,
  listThreadsForModeration,
  sendCustomerMessage,
  sendModeratorMessage
} from '../src/services/chat.service.js';
import { ChatThreadModel } from '../src/models/chat-thread.model.js';
import { UserModel } from '../src/models/user.model.js';
import { USER_ROLES } from '../src/types/user-role.js';
import { emitChatThreadUpdated } from '../src/sockets/chat.socket.js';

type ChatThreadModelMock = jest.Mock & {
  findOne: jest.Mock;
  findById: jest.Mock;
  find: jest.Mock;
};

jest.mock('../src/models/chat-thread.model.js', () => {
  const model = Object.assign(jest.fn(), {
    findOne: jest.fn(),
    findById: jest.fn(),
    find: jest.fn()
  });

  return {
    ChatThreadModel: model
  };
});

jest.mock('../src/models/user.model.js', () => ({
  UserModel: {
    findById: jest.fn()
  }
}));

jest.mock('../src/sockets/chat.socket.js', () => ({
  emitChatThreadUpdated: jest.fn()
}));

const customerUser = {
  _id: new Types.ObjectId(),
  firstName: 'Vlad',
  lastName: 'Sosnov',
  email: 'vlad@bakery.local'
};

const threadView = {
  _id: new Types.ObjectId(),
  customerId: customerUser,
  unreadForSupport: true,
  lastMessageAt: new Date(),
  messages: [
    {
      _id: new Types.ObjectId(),
      senderRole: 'customer',
      text: 'Hi',
      createdAt: new Date()
    }
  ]
};

describe('chat service', () => {
  const chatThreadModelMock = ChatThreadModel as unknown as ChatThreadModelMock;
  const chatFindOneMock = chatThreadModelMock.findOne;
  const chatFindByIdMock = chatThreadModelMock.findById;
  const chatFindMock = chatThreadModelMock.find;
  const userFindByIdMock = UserModel.findById as jest.MockedFunction<typeof UserModel.findById>;
  const emitChatThreadUpdatedMock = emitChatThreadUpdated as jest.MockedFunction<typeof emitChatThreadUpdated>;

  beforeEach(() => {
    chatThreadModelMock.mockReset();
    chatFindOneMock.mockReset();
    chatFindByIdMock.mockReset();
    chatFindMock.mockReset();
    userFindByIdMock.mockReset();
    emitChatThreadUpdatedMock.mockReset();
  });

  it('loads customer thread and maps response', async () => {
    chatFindOneMock.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(threadView)
      })
    });

    const result = await getCustomerThread(String(customerUser._id));

    expect(result?.customerEmail).toBe('vlad@bakery.local');
    expect(result?.messages).toHaveLength(1);
  });

  it('returns null when customer thread is missing', async () => {
    chatFindOneMock.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(null)
      })
    });

    const result = await getCustomerThread('u1');
    expect(result).toBeNull();
  });

  it('throws on invalid customer role and empty text', async () => {
    await expect(sendCustomerMessage('u1', USER_ROLES.moderator, 'hello')).rejects.toBeInstanceOf(ChatError);
    await expect(sendCustomerMessage('u1', USER_ROLES.customer, '   ')).rejects.toMatchObject({
      code: 'VALIDATION_ERROR',
      statusCode: 400
    });
  });

  it('creates a new thread, appends system reply, and emits updates', async () => {
    const newThread = {
      id: String(new Types.ObjectId()),
      messages: [] as Array<{ senderRole: string; text: string; createdAt: Date; senderId?: Types.ObjectId }>,
      lastMessageAt: new Date(),
      unreadForSupport: false,
      save: jest.fn().mockResolvedValue(undefined)
    };
    chatThreadModelMock.mockReturnValue(newThread);
    chatFindOneMock.mockResolvedValue(null);
    userFindByIdMock.mockReturnValue({
      lean: jest.fn().mockResolvedValue(customerUser)
    } as never);
    chatFindByIdMock.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue({
          ...threadView,
          _id: new Types.ObjectId(newThread.id),
          messages: newThread.messages,
          lastMessageAt: newThread.lastMessageAt,
          unreadForSupport: true
        })
      })
    });

    const result = await sendCustomerMessage(String(customerUser._id), USER_ROLES.customer, 'Need help');

    expect(newThread.save).toHaveBeenCalled();
    expect(result.messages).toHaveLength(2);
    expect(result.messages[1].senderRole).toBe('system');
    expect(emitChatThreadUpdatedMock).toHaveBeenCalledTimes(1);
  });

  it('throws when customer not found', async () => {
    userFindByIdMock.mockReturnValue({
      lean: jest.fn().mockResolvedValue(null)
    } as never);

    await expect(sendCustomerMessage('u1', USER_ROLES.customer, 'hello')).rejects.toMatchObject({
      code: 'USER_NOT_FOUND',
      statusCode: 404
    });
  });

  it('throws when populated customer thread cannot be found after save', async () => {
    const existingThread = {
      id: String(new Types.ObjectId()),
      messages: [] as Array<{ senderRole: string; text: string; createdAt: Date; senderId?: Types.ObjectId }>,
      lastMessageAt: new Date(),
      unreadForSupport: false,
      save: jest.fn().mockResolvedValue(undefined)
    };
    chatFindOneMock.mockResolvedValue(existingThread);
    userFindByIdMock.mockReturnValue({
      lean: jest.fn().mockResolvedValue(customerUser)
    } as never);
    chatFindByIdMock.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(null)
      })
    });

    await expect(sendCustomerMessage(String(customerUser._id), USER_ROLES.customer, 'hello')).rejects.toMatchObject({
      code: 'CHAT_THREAD_NOT_FOUND',
      statusCode: 404
    });
  });

  it('lists threads for moderator/admin and forbids customer', async () => {
    chatFindMock.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue([threadView])
        })
      })
    });

    const result = await listThreadsForModeration(USER_ROLES.moderator);
    expect(result).toHaveLength(1);

    await expect(listThreadsForModeration(USER_ROLES.customer)).rejects.toMatchObject({
      code: 'FORBIDDEN',
      statusCode: 403
    });
  });

  it('gets thread by id for moderation and marks unread as read', async () => {
    const thread = {
      unreadForSupport: true,
      save: jest.fn().mockResolvedValue(undefined)
    };
    chatFindByIdMock.mockResolvedValueOnce(thread as never);
    chatFindByIdMock.mockReturnValueOnce({
      populate: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(threadView)
      })
    });

    const result = await getThreadByIdForModeration(USER_ROLES.admin, String(new Types.ObjectId()));

    expect(thread.save).toHaveBeenCalled();
    expect(result.customerName).toContain('Vlad');
    expect(emitChatThreadUpdatedMock).toHaveBeenCalled();
  });

  it('throws for invalid or missing thread id in moderation lookup', async () => {
    await expect(getThreadByIdForModeration(USER_ROLES.moderator, 'bad-id')).rejects.toMatchObject({
      code: 'VALIDATION_ERROR',
      statusCode: 400
    });

    chatFindByIdMock.mockResolvedValue(null);
    await expect(getThreadByIdForModeration(USER_ROLES.moderator, String(new Types.ObjectId()))).rejects.toMatchObject(
      {
        code: 'CHAT_THREAD_NOT_FOUND',
        statusCode: 404
      }
    );
  });

  it('sends moderator message and handles missing populated thread', async () => {
    const thread = {
      id: String(new Types.ObjectId()),
      messages: [] as Array<{ senderRole: string; text: string; createdAt: Date; senderId?: Types.ObjectId }>,
      save: jest.fn().mockResolvedValue(undefined),
      lastMessageAt: new Date(),
      unreadForSupport: true
    };
    chatFindByIdMock.mockResolvedValueOnce(thread as never);
    chatFindByIdMock.mockReturnValueOnce({
      populate: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue({
          ...threadView,
          messages: [
            ...threadView.messages,
            {
              _id: new Types.ObjectId(),
              senderRole: 'moderator',
              text: 'reply',
              createdAt: new Date()
            }
          ]
        })
      })
    });

    const result = await sendModeratorMessage(
      USER_ROLES.moderator,
      String(new Types.ObjectId()),
      String(new Types.ObjectId()),
      'reply'
    );

    expect(thread.save).toHaveBeenCalled();
    expect(result.messages.at(-1)?.senderRole).toBe('moderator');
  });

  it('throws for invalid moderator payloads', async () => {
    await expect(
      sendModeratorMessage(USER_ROLES.customer, String(new Types.ObjectId()), String(new Types.ObjectId()), 'reply')
    ).rejects.toMatchObject({
      code: 'FORBIDDEN',
      statusCode: 403
    });
    await expect(
      sendModeratorMessage(USER_ROLES.moderator, String(new Types.ObjectId()), 'bad-id', 'reply')
    ).rejects.toMatchObject({
      code: 'VALIDATION_ERROR',
      statusCode: 400
    });

    chatFindByIdMock.mockResolvedValue(null);
    await expect(
      sendModeratorMessage(
        USER_ROLES.moderator,
        String(new Types.ObjectId()),
        String(new Types.ObjectId()),
        'reply'
      )
    ).rejects.toMatchObject({
      code: 'CHAT_THREAD_NOT_FOUND',
      statusCode: 404
    });
  });
});
