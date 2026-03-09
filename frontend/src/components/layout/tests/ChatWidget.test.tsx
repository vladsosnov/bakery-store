import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';

import { ChatWidget } from '@src/components/layout/ChatWidget';
import { getMyChatThread, postMyChatMessage } from '@src/services/chat-api';
import { getAuthSession } from '@src/services/auth-session';
import { subscribeToChatThreadUpdates } from '@src/services/chat-socket';

jest.mock('@src/services/auth-session', () => ({
  getAuthSession: jest.fn()
}));

jest.mock('@src/services/chat-api', () => ({
  getMyChatThread: jest.fn(),
  postMyChatMessage: jest.fn()
}));

jest.mock('@src/services/chat-socket', () => ({
  subscribeToChatThreadUpdates: jest.fn(() => () => undefined)
}));

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn()
  }
}));

const customerSession = {
  accessToken: 'token',
  user: {
    id: 'customer-1',
    firstName: 'Vlad',
    lastName: 'Sosnov',
    email: 'vlad@bakery.local',
    role: 'customer' as const
  }
};

const moderatorSession = {
  accessToken: 'token',
  user: {
    id: 'moderator-1',
    firstName: 'Marta',
    lastName: 'Baker',
    email: 'marta@bakery.local',
    role: 'moderator' as const
  }
};

describe('ChatWidget', () => {
  const getAuthSessionMock = jest.mocked(getAuthSession);
  const getMyChatThreadMock = jest.mocked(getMyChatThread);
  const postMyChatMessageMock = jest.mocked(postMyChatMessage);
  const subscribeToChatThreadUpdatesMock = jest.mocked(subscribeToChatThreadUpdates);
  const toastErrorMock = jest.mocked(toast.error);

  beforeEach(() => {
    getAuthSessionMock.mockReset();
    getMyChatThreadMock.mockReset();
    postMyChatMessageMock.mockReset();
    subscribeToChatThreadUpdatesMock.mockReset();
    toastErrorMock.mockReset();
    subscribeToChatThreadUpdatesMock.mockReturnValue(() => undefined);
  });

  it('shows sign-in message for guests and allows closing', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    getAuthSessionMock.mockReturnValue(null);

    render(<ChatWidget onClose={onClose} />);

    expect(screen.getByText(/sign in to start chatting with support/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: /close chat/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows moderator message and blocks sending', async () => {
    const user = userEvent.setup();
    getAuthSessionMock.mockReturnValue(moderatorSession);

    render(<ChatWidget onClose={jest.fn()} />);

    expect(screen.getByText(/open admin dashboard to answer customer chats/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/chat message/i)).toBeDisabled();

    await user.click(screen.getByRole('button', { name: /delivery info/i }));
    expect(toastErrorMock).toHaveBeenCalledWith('Chat inbox is available in Admin dashboard for moderators.');
  });

  it('loads customer messages and sends a new message', async () => {
    const user = userEvent.setup();
    getAuthSessionMock.mockReturnValue(customerSession);
    getMyChatThreadMock.mockResolvedValue({
      data: {
        id: 'thread-1',
        customerId: 'customer-1',
        customerName: 'Vlad Sosnov',
        customerEmail: 'vlad@bakery.local',
        lastMessageAt: new Date().toISOString(),
        lastMessageText: 'Welcome!',
        unreadForSupport: false,
        messages: [
          {
            id: 'm1',
            senderRole: 'system',
            text: 'Welcome!',
            createdAt: new Date().toISOString()
          }
        ]
      }
    });
    postMyChatMessageMock.mockResolvedValue({
      data: {
        id: 'thread-1',
        customerId: 'customer-1',
        customerName: 'Vlad Sosnov',
        customerEmail: 'vlad@bakery.local',
        lastMessageAt: new Date().toISOString(),
        lastMessageText: 'Need custom cake',
        unreadForSupport: true,
        messages: [
          {
            id: 'm1',
            senderRole: 'system',
            text: 'Welcome!',
            createdAt: new Date().toISOString()
          },
          {
            id: 'm2',
            senderRole: 'customer',
            text: 'Need custom cake',
            createdAt: new Date().toISOString()
          }
        ]
      }
    });

    render(<ChatWidget onClose={jest.fn()} />);

    expect(await screen.findByText(/welcome!/i)).toBeInTheDocument();
    expect(subscribeToChatThreadUpdatesMock).toHaveBeenCalledTimes(1);

    await user.type(screen.getByLabelText(/chat message/i), 'Need custom cake');
    await user.click(screen.getByRole('button', { name: /^send$/i }));

    await waitFor(() => {
      expect(postMyChatMessageMock).toHaveBeenCalledWith({ text: 'Need custom cake' });
    });
    expect(screen.getByDisplayValue('')).toBeInTheDocument();
  });

  it('handles socket updates only for current customer', async () => {
    getAuthSessionMock.mockReturnValue(customerSession);
    getMyChatThreadMock.mockResolvedValue({ data: null });

    let threadUpdateHandler: ((thread: {
      id: string;
      customerId: string;
      customerName: string;
      customerEmail: string;
      lastMessageAt: string;
      lastMessageText: string;
      unreadForSupport: boolean;
      messages: Array<{ id: string; senderRole: 'customer' | 'moderator' | 'system'; text: string; createdAt: string }>;
    }) => void) | null = null;
    subscribeToChatThreadUpdatesMock.mockImplementation((handler) => {
      threadUpdateHandler = handler;
      return () => undefined;
    });

    render(<ChatWidget onClose={jest.fn()} />);

    await waitFor(() => {
      expect(subscribeToChatThreadUpdatesMock).toHaveBeenCalled();
    });

    act(() => {
      threadUpdateHandler?.({
        id: 'thread-2',
        customerId: 'other-customer',
        customerName: 'Other',
        customerEmail: 'other@bakery.local',
        lastMessageAt: new Date().toISOString(),
        lastMessageText: 'ignore',
        unreadForSupport: true,
        messages: [
          {
            id: 'm-ignore',
            senderRole: 'customer',
            text: 'ignore',
            createdAt: new Date().toISOString()
          }
        ]
      });
    });
    expect(screen.queryByText('ignore')).not.toBeInTheDocument();

    act(() => {
      threadUpdateHandler?.({
        id: 'thread-1',
        customerId: 'customer-1',
        customerName: 'Vlad Sosnov',
        customerEmail: 'vlad@bakery.local',
        lastMessageAt: new Date().toISOString(),
        lastMessageText: 'updated text',
        unreadForSupport: true,
        messages: [
          {
            id: 'm1',
            senderRole: 'customer',
            text: 'updated text',
            createdAt: new Date().toISOString()
          }
        ]
      });
    });
    expect(await screen.findByText(/updated text/i)).toBeInTheDocument();
  });

  it('shows toast on load and send failures', async () => {
    const user = userEvent.setup();
    getAuthSessionMock.mockReturnValue(customerSession);
    getMyChatThreadMock.mockRejectedValue(new Error('load failed'));
    postMyChatMessageMock.mockRejectedValue(new Error('send failed'));

    render(<ChatWidget onClose={jest.fn()} />);

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith('Failed to load chat messages.');
    });

    await user.type(screen.getByLabelText(/chat message/i), 'hello');
    await user.click(screen.getByRole('button', { name: /^send$/i }));

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith('Failed to send message.');
    });
  });
});
