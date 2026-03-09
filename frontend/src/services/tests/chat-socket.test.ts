import type { ChatThread } from '@src/types/chat';

const ioMock = jest.fn();

jest.mock('socket.io-client', () => ({
  io: (...args: unknown[]) => ioMock(...args)
}));

jest.mock('@src/services/auth-session', () => ({
  getAuthSession: jest.fn()
}));

describe('chat-socket service', () => {
  const originalEnv = process.env.NODE_ENV;
  const onMock = jest.fn();
  const offMock = jest.fn();
  const disconnectMock = jest.fn();

  const createSocket = () => ({
    on: onMock,
    off: offMock,
    disconnect: disconnectMock
  });

  const loadModule = async () => import('../chat-socket');
  const getAuthSessionMock = () =>
    jest.requireMock('@src/services/auth-session').getAuthSession as jest.Mock;

  beforeEach(() => {
    jest.resetModules();
    ioMock.mockReset();
    onMock.mockReset();
    offMock.mockReset();
    disconnectMock.mockReset();
    process.env.NODE_ENV = 'development';
    delete process.env.ENABLE_CHAT_SOCKET_TESTS;
  });

  afterAll(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('returns noop in test environment', async () => {
    process.env.NODE_ENV = 'test';
    const { subscribeToChatThreadUpdates } = await loadModule();

    const unsubscribe = subscribeToChatThreadUpdates(() => undefined);

    expect(ioMock).not.toHaveBeenCalled();
    expect(typeof unsubscribe).toBe('function');
  });

  it('returns noop when session is missing', async () => {
    getAuthSessionMock().mockReturnValue(null);
    const { subscribeToChatThreadUpdates } = await loadModule();

    const unsubscribe = subscribeToChatThreadUpdates(() => undefined);

    expect(ioMock).not.toHaveBeenCalled();
    expect(typeof unsubscribe).toBe('function');
  });

  it('subscribes and unsubscribes with socket connection', async () => {
    process.env.ENABLE_CHAT_SOCKET_TESTS = 'true';
    const socket = createSocket();
    ioMock.mockReturnValue(socket);
    getAuthSessionMock().mockReturnValue({
      accessToken: 'token-1',
      user: {
        id: 'u1',
        firstName: 'Vlad',
        lastName: 'Sosnov',
        email: 'vlad@bakery.local',
        role: 'moderator'
      }
    });
    const { subscribeToChatThreadUpdates } = await loadModule();
    const handler = (thread: ChatThread) => thread.id;

    const unsubscribe = subscribeToChatThreadUpdates(handler);

    expect(ioMock).toHaveBeenCalledWith('http://localhost:4000', {
      transports: ['websocket'],
      auth: { token: 'token-1' }
    });
    expect(onMock).toHaveBeenCalledWith('chat:thread-updated', handler);

    unsubscribe();
    expect(offMock).toHaveBeenCalledWith('chat:thread-updated', handler);
  });

  it('reconnects when token changes', async () => {
    process.env.ENABLE_CHAT_SOCKET_TESTS = 'true';
    const firstSocket = createSocket();
    const secondSocket = createSocket();
    ioMock.mockReturnValueOnce(firstSocket).mockReturnValueOnce(secondSocket);

    const { subscribeToChatThreadUpdates } = await loadModule();
    const handler = () => undefined;

    getAuthSessionMock().mockReturnValue({
      accessToken: 'token-1',
      user: {
        id: 'u1',
        firstName: 'Vlad',
        lastName: 'Sosnov',
        email: 'vlad@bakery.local',
        role: 'moderator'
      }
    });
    subscribeToChatThreadUpdates(handler);

    getAuthSessionMock().mockReturnValue({
      accessToken: 'token-2',
      user: {
        id: 'u1',
        firstName: 'Vlad',
        lastName: 'Sosnov',
        email: 'vlad@bakery.local',
        role: 'moderator'
      }
    });
    subscribeToChatThreadUpdates(handler);

    expect(disconnectMock).toHaveBeenCalledTimes(1);
    expect(ioMock).toHaveBeenCalledTimes(2);
  });
});
