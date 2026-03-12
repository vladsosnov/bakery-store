import { render, screen, waitFor } from '@testing-library/react';

import { getModeratorChatThreads } from '@src/services/chat-api';
import { LogsTab } from './LogsTab';

jest.mock('@src/services/chat-api', () => ({
  getModeratorChatThreads: jest.fn()
}));

jest.mock('highcharts-react-official', () => ({
  __esModule: true,
  default: () => <div data-testid="chart" />
}));

const mockedGetModeratorChatThreads = jest.mocked(getModeratorChatThreads);

describe('LogsTab', () => {
  afterEach(() => {
    mockedGetModeratorChatThreads.mockReset();
  });

  it('renders order/user metrics and chat metrics', async () => {
    const today = new Date().toISOString();
    mockedGetModeratorChatThreads.mockResolvedValue({
      data: [
        {
          id: 'thread-1',
          customerId: 'c1',
          customerName: 'John Doe',
          customerEmail: 'john@bakery.local',
          lastMessageAt: today,
          lastMessageText: 'Thanks',
          unreadForSupport: true,
          messages: [
            { id: 'm1', senderRole: 'customer', text: 'Hi', createdAt: today },
            { id: 'm2', senderRole: 'moderator', text: 'Hello', createdAt: today }
          ]
        }
      ]
    });

    render(
      <LogsTab
        orders={[
          {
            id: 'o1',
            customerEmail: 'john@bakery.local',
            customerName: 'John Doe',
            customerPhone: '+15550001122',
            status: 'placed',
            note: '',
            totalItems: 2,
            totalPrice: 16,
            createdAt: today,
            items: [],
            deliveryAddress: { zip: '10001', street: '5th Avenue 10', city: 'New York' }
          }
        ]}
        users={[
          {
            id: 'u1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@bakery.local',
            role: 'customer',
            isActive: true,
            createdAt: today,
            updatedAt: today
          }
        ]}
      />
    );

    expect(screen.getByText(/total orders/i)).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/total chat messages/i)).toBeInTheDocument();
    });
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('shows chat load error when chat metrics fail', async () => {
    mockedGetModeratorChatThreads.mockRejectedValue(new Error('network'));

    render(<LogsTab orders={[]} users={[]} />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load chat metrics\./i)).toBeInTheDocument();
    });
  });
});
