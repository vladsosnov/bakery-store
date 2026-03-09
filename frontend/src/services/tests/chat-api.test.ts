import {
  getModeratorChatThread,
  getModeratorChatThreads,
  getMyChatThread,
  postModeratorChatMessage,
  postMyChatMessage
} from '../chat-api';
import { apiAuthClient } from '../api-client';

jest.mock('../api-client', () => ({
  apiAuthClient: {
    get: jest.fn(),
    post: jest.fn()
  }
}));

const mockedApiAuthClient = jest.mocked(apiAuthClient);

describe('chat-api service', () => {
  afterEach(() => {
    mockedApiAuthClient.get.mockReset();
    mockedApiAuthClient.post.mockReset();
  });

  it('calls my thread endpoint', async () => {
    mockedApiAuthClient.get.mockResolvedValue({ data: { data: null } });

    await getMyChatThread();

    expect(mockedApiAuthClient.get).toHaveBeenCalledWith('/api/chat/me');
  });

  it('posts customer message', async () => {
    mockedApiAuthClient.post.mockResolvedValue({ data: { data: { id: 'thread-1' } } });

    await postMyChatMessage({ text: 'hello' });

    expect(mockedApiAuthClient.post).toHaveBeenCalledWith('/api/chat/me/messages', { text: 'hello' });
  });

  it('calls moderator threads endpoint', async () => {
    mockedApiAuthClient.get.mockResolvedValue({ data: { data: [] } });

    await getModeratorChatThreads();

    expect(mockedApiAuthClient.get).toHaveBeenCalledWith('/api/chat/threads');
  });

  it('calls moderator thread details endpoint', async () => {
    mockedApiAuthClient.get.mockResolvedValue({ data: { data: { id: 'thread-1' } } });

    await getModeratorChatThread('thread-1');

    expect(mockedApiAuthClient.get).toHaveBeenCalledWith('/api/chat/threads/thread-1');
  });

  it('posts moderator message', async () => {
    mockedApiAuthClient.post.mockResolvedValue({ data: { data: { id: 'thread-1' } } });

    await postModeratorChatMessage('thread-1', { text: 'reply' });

    expect(mockedApiAuthClient.post).toHaveBeenCalledWith('/api/chat/threads/thread-1/messages', {
      text: 'reply'
    });
  });
});
