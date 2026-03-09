import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';

import {
  getModeratorChatThread,
  getModeratorChatThreads,
  postModeratorChatMessage
} from '@src/services/chat-api';
import { subscribeToChatThreadUpdates } from '@src/services/chat-socket';
import { ChatsTab } from './ChatsTab';

jest.mock('@src/services/chat-api', () => ({
  getModeratorChatThreads: jest.fn(),
  getModeratorChatThread: jest.fn(),
  postModeratorChatMessage: jest.fn()
}));

jest.mock('@src/services/chat-socket', () => ({
  subscribeToChatThreadUpdates: jest.fn(() => () => undefined)
}));

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn()
  }
}));

const baseThread = {
  id: 'thread-1',
  customerId: 'c1',
  customerName: 'John Doe',
  customerEmail: 'john@bakery.local',
  lastMessageAt: new Date().toISOString(),
  lastMessageText: 'Hi there',
  unreadForSupport: true,
  messages: [
    {
      id: 'm1',
      senderRole: 'customer' as const,
      text: 'Hi there',
      createdAt: new Date().toISOString()
    }
  ]
};

describe('ChatsTab', () => {
  const getModeratorChatThreadsMock = jest.mocked(getModeratorChatThreads);
  const getModeratorChatThreadMock = jest.mocked(getModeratorChatThread);
  const postModeratorChatMessageMock = jest.mocked(postModeratorChatMessage);
  const subscribeToChatThreadUpdatesMock = jest.mocked(subscribeToChatThreadUpdates);
  const toastErrorMock = jest.mocked(toast.error);

  beforeEach(() => {
    getModeratorChatThreadsMock.mockReset();
    getModeratorChatThreadMock.mockReset();
    postModeratorChatMessageMock.mockReset();
    subscribeToChatThreadUpdatesMock.mockReset();
    toastErrorMock.mockReset();
    subscribeToChatThreadUpdatesMock.mockReturnValue(() => undefined);
  });

  it('renders threads and selected conversation', async () => {
    getModeratorChatThreadsMock.mockResolvedValue({
      data: [baseThread]
    });
    getModeratorChatThreadMock.mockResolvedValue({
      data: baseThread
    });

    render(<ChatsTab />);

    expect(await screen.findByText(/john doe/i)).toBeInTheDocument();
    expect(await screen.findByText(/conversation with john doe/i)).toBeInTheDocument();
    expect((await screen.findAllByText(/hi there/i)).length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/unread messages/i)).toBeInTheDocument();
  });

  it('sends moderator reply', async () => {
    const user = userEvent.setup();
    getModeratorChatThreadsMock.mockResolvedValue({
      data: [baseThread]
    });
    getModeratorChatThreadMock.mockResolvedValue({
      data: baseThread
    });
    postModeratorChatMessageMock.mockResolvedValue({
      data: {
        ...baseThread,
        unreadForSupport: false,
        messages: [
          ...baseThread.messages,
          {
            id: 'm2',
            senderRole: 'moderator',
            text: 'Sure, on it!',
            createdAt: new Date().toISOString()
          }
        ]
      }
    });

    render(<ChatsTab />);

    const input = await screen.findByLabelText(/moderator chat reply/i);
    await waitFor(() => {
      expect(input).toBeEnabled();
    });
    await user.type(input, 'Sure, on it!');
    await user.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(postModeratorChatMessageMock).toHaveBeenCalledWith('thread-1', {
        text: 'Sure, on it!'
      });
    });
  });

  it('shows toast when loading threads fails', async () => {
    getModeratorChatThreadsMock.mockRejectedValue(new Error('network'));

    render(<ChatsTab />);

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith('Failed to load chats.');
    });
  });
});
