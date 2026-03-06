import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';

import { createAdminModerator } from '@src/services/admin-api';
import { CreateModeratorModal } from '../CreateModeratorModal';

jest.mock('@src/services/admin-api', () => ({
  createAdminModerator: jest.fn()
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

const mockedCreateAdminModerator = jest.mocked(createAdminModerator);
const mockedToastSuccess = jest.mocked(toast.success);
const mockedToastError = jest.mocked(toast.error);

describe('CreateModeratorModal', () => {
  afterEach(() => {
    mockedCreateAdminModerator.mockReset();
    mockedToastSuccess.mockReset();
    mockedToastError.mockReset();
  });

  it('does not render when closed', () => {
    render(<CreateModeratorModal isOpen={false} onClose={jest.fn()} onCreated={jest.fn()} />);

    expect(screen.queryByRole('dialog', { name: /create moderator dialog/i })).not.toBeInTheDocument();
  });

  it('creates moderator and closes on success', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    const onCreated = jest.fn();
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

    mockedCreateAdminModerator.mockResolvedValue({ data: moderator });

    render(<CreateModeratorModal isOpen onClose={onClose} onCreated={onCreated} />);

    await user.type(screen.getByLabelText(/first name/i), 'Marta');
    await user.type(screen.getByLabelText(/last name/i), 'Baker');
    await user.type(screen.getByLabelText(/email/i), 'marta@bakery.com');
    await user.type(screen.getByLabelText(/temporary password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /create moderator/i }));

    await waitFor(() => {
      expect(mockedCreateAdminModerator).toHaveBeenCalledWith({
        firstName: 'Marta',
        lastName: 'Baker',
        email: 'marta@bakery.com',
        password: 'password123'
      });
    });
    expect(onCreated).toHaveBeenCalledWith(moderator);
    expect(onClose).toHaveBeenCalled();
    expect(mockedToastSuccess).toHaveBeenCalledWith('Moderator created successfully.');
  });

  it('shows error toast on failed create', async () => {
    const user = userEvent.setup();

    mockedCreateAdminModerator.mockRejectedValue(new Error('network'));

    render(<CreateModeratorModal isOpen onClose={jest.fn()} onCreated={jest.fn()} />);

    await user.type(screen.getByLabelText(/first name/i), 'Marta');
    await user.type(screen.getByLabelText(/last name/i), 'Baker');
    await user.type(screen.getByLabelText(/email/i), 'marta@bakery.com');
    await user.type(screen.getByLabelText(/temporary password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /create moderator/i }));

    await waitFor(() => {
      expect(mockedToastError).toHaveBeenCalledWith('Failed to create moderator.');
    });
  });
});
