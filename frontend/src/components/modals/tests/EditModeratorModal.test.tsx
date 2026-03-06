import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';

import { updateAdminModerator } from '@src/services/admin-api';
import { EditModeratorModal } from '../EditModeratorModal';

jest.mock('@src/services/admin-api', () => ({
  updateAdminModerator: jest.fn()
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

const mockedUpdateAdminModerator = jest.mocked(updateAdminModerator);
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

describe('EditModeratorModal', () => {
  afterEach(() => {
    mockedUpdateAdminModerator.mockReset();
    mockedToastSuccess.mockReset();
    mockedToastError.mockReset();
  });

  it('does not render when closed or moderator is missing', () => {
    const { rerender } = render(
      <EditModeratorModal isOpen={false} moderator={moderator} onClose={jest.fn()} onUpdated={jest.fn()} />
    );
    expect(screen.queryByRole('dialog', { name: /edit moderator dialog/i })).not.toBeInTheDocument();

    rerender(<EditModeratorModal isOpen moderator={null} onClose={jest.fn()} onUpdated={jest.fn()} />);
    expect(screen.queryByRole('dialog', { name: /edit moderator dialog/i })).not.toBeInTheDocument();
  });

  it('updates moderator and closes on success', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    const onUpdated = jest.fn();
    const updatedModerator = {
      ...moderator,
      firstName: 'Anna',
      isActive: false
    };

    mockedUpdateAdminModerator.mockResolvedValue({ data: updatedModerator });

    render(<EditModeratorModal isOpen moderator={moderator} onClose={onClose} onUpdated={onUpdated} />);

    const firstNameInput = screen.getByLabelText(/first name/i);
    await user.clear(firstNameInput);
    await user.type(firstNameInput, 'Anna');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: /^save$/i }));

    await waitFor(() => {
      expect(mockedUpdateAdminModerator).toHaveBeenCalledWith('m1', {
        firstName: 'Anna',
        lastName: 'Baker',
        email: 'marta@bakery.com',
        isActive: false
      });
    });
    expect(onUpdated).toHaveBeenCalledWith(updatedModerator);
    expect(onClose).toHaveBeenCalled();
    expect(mockedToastSuccess).toHaveBeenCalledWith('Moderator updated successfully.');
  });

  it('shows error toast on failed update', async () => {
    const user = userEvent.setup();

    mockedUpdateAdminModerator.mockRejectedValue(new Error('network'));

    render(<EditModeratorModal isOpen moderator={moderator} onClose={jest.fn()} onUpdated={jest.fn()} />);

    await user.click(screen.getByRole('button', { name: /^save$/i }));

    await waitFor(() => {
      expect(mockedToastError).toHaveBeenCalledWith('Failed to update moderator.');
    });
  });
});
