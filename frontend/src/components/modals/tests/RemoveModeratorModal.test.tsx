import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';

import { deleteAdminModerator } from '@src/services/admin-api';
import { RemoveModeratorModal } from '../RemoveModeratorModal';

jest.mock('@src/services/admin-api', () => ({
  deleteAdminModerator: jest.fn()
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

const mockedDeleteAdminModerator = jest.mocked(deleteAdminModerator);
const mockedToastSuccess = jest.mocked(toast.success);
const mockedToastError = jest.mocked(toast.error);

const moderator = {
  id: 'm1',
  firstName: 'Marta',
  lastName: 'Baker',
  email: 'marta@bakery.com',
  role: 'moderator' as const,
  isActive: true,
  createdAt: null,
  updatedAt: null
};

describe('RemoveModeratorModal', () => {
  afterEach(() => {
    mockedDeleteAdminModerator.mockReset();
    mockedToastSuccess.mockReset();
    mockedToastError.mockReset();
  });

  it('does not render when closed or moderator is missing', () => {
    const { rerender } = render(
      <RemoveModeratorModal isOpen={false} moderator={moderator} onClose={jest.fn()} onRemoved={jest.fn()} />
    );
    expect(
      screen.queryByRole('dialog', { name: /remove moderator confirmation dialog/i })
    ).not.toBeInTheDocument();

    rerender(<RemoveModeratorModal isOpen moderator={null} onClose={jest.fn()} onRemoved={jest.fn()} />);
    expect(
      screen.queryByRole('dialog', { name: /remove moderator confirmation dialog/i })
    ).not.toBeInTheDocument();
  });

  it('removes moderator and closes on success', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    const onRemoved = jest.fn();

    mockedDeleteAdminModerator.mockResolvedValue(undefined);

    render(<RemoveModeratorModal isOpen moderator={moderator} onClose={onClose} onRemoved={onRemoved} />);

    expect(screen.getByText(/are you sure you want to remove marta baker/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /remove moderator/i }));

    await waitFor(() => {
      expect(mockedDeleteAdminModerator).toHaveBeenCalledWith('m1');
    });
    expect(onRemoved).toHaveBeenCalledWith('m1');
    expect(onClose).toHaveBeenCalled();
    expect(mockedToastSuccess).toHaveBeenCalledWith('Moderator removed successfully.');
  });

  it('shows error toast on failed removal', async () => {
    const user = userEvent.setup();

    mockedDeleteAdminModerator.mockRejectedValue(new Error('network'));

    render(<RemoveModeratorModal isOpen moderator={moderator} onClose={jest.fn()} onRemoved={jest.fn()} />);

    await user.click(screen.getByRole('button', { name: /remove moderator/i }));

    await waitFor(() => {
      expect(mockedToastError).toHaveBeenCalledWith('Failed to remove moderator.');
    });
  });
});
