import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { UsersTab } from './UsersTab';

describe('UsersTab', () => {
  it('renders users and supports moderator actions', async () => {
    const user = userEvent.setup();
    const onOpenCreateModeratorModal = jest.fn();
    const onEditClick = jest.fn();
    const onDeleteClick = jest.fn();

    render(
      <UsersTab
        isLoading={false}
        users={[
          {
            id: 'm1',
            firstName: 'Marta',
            lastName: 'Baker',
            email: 'marta@bakery.local',
            role: 'moderator',
            isActive: true,
            createdAt: null,
            updatedAt: null
          },
          {
            id: 'c1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@bakery.local',
            role: 'customer',
            isActive: true,
            createdAt: null,
            updatedAt: null
          }
        ]}
        onOpenCreateModeratorModal={onOpenCreateModeratorModal}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
      />
    );

    await user.click(screen.getByRole('button', { name: /create moderator/i }));
    await user.click(screen.getByRole('button', { name: /^edit$/i }));
    await user.click(screen.getByRole('button', { name: /remove/i }));

    expect(screen.getByText(/marta baker/i)).toBeInTheDocument();
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    expect(onOpenCreateModeratorModal).toHaveBeenCalledTimes(1);
    expect(onEditClick).toHaveBeenCalledTimes(1);
    expect(onDeleteClick).toHaveBeenCalledTimes(1);
    expect(screen.getAllByRole('button', { name: /remove/i })).toHaveLength(1);
  });

  it('shows loading state', () => {
    render(
      <UsersTab
        isLoading
        users={[]}
        onOpenCreateModeratorModal={jest.fn()}
        onEditClick={jest.fn()}
        onDeleteClick={jest.fn()}
      />
    );

    expect(screen.getByText(/loading users/i)).toBeInTheDocument();
  });
});
