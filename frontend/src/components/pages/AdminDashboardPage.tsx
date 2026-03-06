import axios from 'axios';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FC,
  type FormEventHandler,
  type MouseEvent
} from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

import { ROUTES } from '@src/app/routes';
import {
  createAdminModerator,
  deleteAdminModerator,
  getAdminOrders,
  getAdminUsers,
  type AdminOrder,
  type AdminUser,
  updateAdminModerator
} from '@src/services/admin-api';
import { getAuthSession } from '@src/services/auth-session';
import { USER_ROLES } from '@src/types/user-role';
import * as S from './AdminDashboardPage.styles';

type AdminTab = 'users' | 'orders' | 'logs';

type EditModeratorState = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
};

type RemoveModeratorState = {
  userId: string;
  fullName: string;
};

export const AdminDashboardPage: FC = () => {
  const session = useMemo(() => getAuthSession(), []);
  const isAdmin = session?.user.role === USER_ROLES.admin;
  const isModerator = session?.user.role === USER_ROLES.moderator;
  const dashboardSubtitle = isAdmin
    ? 'Manage users and moderators, inspect orders, and prepare usage logs.'
    : 'Inspect and manage customer orders.';
  const [activeTab, setActiveTab] = useState<AdminTab>(() =>
    session?.user.role === USER_ROLES.moderator ? 'orders' : 'users'
  );
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateSubmitting, setIsCreateSubmitting] = useState(false);
  const [editState, setEditState] = useState<EditModeratorState | null>(null);
  const [removeState, setRemoveState] = useState<RemoveModeratorState | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);

    try {
      if (isAdmin) {
        const [usersResponse, ordersResponse] = await Promise.all([getAdminUsers(), getAdminOrders()]);
        setUsers(usersResponse.data);
        setOrders(ordersResponse.data);
      } else {
        const ordersResponse = await getAdminOrders();
        setUsers([]);
        setOrders(ordersResponse.data);
      }
    } catch (error) {
      const errorMessage = axios.isAxiosError<{ error?: string }>(error)
        ? error.response?.data?.error ?? 'Failed to load admin dashboard.'
        : 'Failed to load admin dashboard.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!session || (!isAdmin && !isModerator)) {
      setIsLoading(false);
      return;
    }

    void loadDashboardData();
  }, [session, isAdmin, isModerator, loadDashboardData]);

  useEffect(() => {
    if (isModerator) {
      setActiveTab('orders');
    }
  }, [isModerator]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCreateModalOpen(false);
        setEditState(null);
        setRemoveState(null);
      }
    };

    if (isCreateModalOpen || editState || removeState) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCreateModalOpen, editState, removeState]);

  const handleCreateFirstNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value);
  };

  const handleCreateLastNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
  };

  const handleCreateEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleCreatePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleCreateModeratorSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setIsCreateSubmitting(true);

    try {
      const response = await createAdminModerator({
        firstName,
        lastName,
        email,
        password
      });

      setUsers((prev) => [response.data, ...prev]);
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setIsCreateModalOpen(false);
      toast.success('Moderator created successfully.');
    } catch (error) {
      const errorMessage = axios.isAxiosError<{ error?: string }>(error)
        ? error.response?.data?.error ?? 'Failed to create moderator.'
        : 'Failed to create moderator.';
      toast.error(errorMessage);
    } finally {
      setIsCreateSubmitting(false);
    }
  };

  const handleEditClick = (event: MouseEvent<HTMLButtonElement>) => {
    const userId = event.currentTarget.dataset.userId;
    if (!userId) {
      return;
    }

    const user = users.find((existingUser) => existingUser.id === userId);
    if (!user) {
      return;
    }

    setRemoveState(null);
    setEditState({
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isActive: user.isActive
    });
  };

  const handleEditFirstNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!editState) {
      return;
    }

    setEditState({
      ...editState,
      firstName: event.target.value
    });
  };

  const handleEditLastNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!editState) {
      return;
    }

    setEditState({
      ...editState,
      lastName: event.target.value
    });
  };

  const handleEditEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!editState) {
      return;
    }

    setEditState({
      ...editState,
      email: event.target.value
    });
  };

  const handleEditIsActiveChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!editState) {
      return;
    }

    setEditState({
      ...editState,
      isActive: event.target.checked
    });
  };

  const handleSaveEditClick = async () => {
    if (!editState) {
      return;
    }

    setEditingUserId(editState.userId);
    try {
      const response = await updateAdminModerator(editState.userId, {
        firstName: editState.firstName,
        lastName: editState.lastName,
        email: editState.email,
        isActive: editState.isActive
      });

      setUsers((prev) =>
        prev.map((user) => (user.id === editState.userId ? response.data : user))
      );
      setEditState(null);
      toast.success('Moderator updated successfully.');
    } catch (error) {
      const errorMessage = axios.isAxiosError<{ error?: string }>(error)
        ? error.response?.data?.error ?? 'Failed to update moderator.'
        : 'Failed to update moderator.';
      toast.error(errorMessage);
    } finally {
      setEditingUserId(null);
    }
  };

  const handleDeleteClick = (event: MouseEvent<HTMLButtonElement>) => {
    const userId = event.currentTarget.dataset.userId;
    if (!userId) {
      return;
    }

    const user = users.find((existingUser) => existingUser.id === userId);
    if (!user) {
      return;
    }

    setEditState(null);
    setRemoveState({
      userId: user.id,
      fullName: `${user.firstName} ${user.lastName}`
    });
  };

  const handleConfirmRemoveClick = async () => {
    if (!removeState) {
      return;
    }

    const userId = removeState.userId;
    setEditingUserId(userId);
    try {
      await deleteAdminModerator(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      setRemoveState(null);
      toast.success('Moderator removed successfully.');
    } catch (error) {
      const errorMessage = axios.isAxiosError<{ error?: string }>(error)
        ? error.response?.data?.error ?? 'Failed to remove moderator.'
        : 'Failed to remove moderator.';
      toast.error(errorMessage);
    } finally {
      setEditingUserId(null);
    }
  };

  const handleUsersTabClick = () => {
    if (!isAdmin) {
      return;
    }

    setActiveTab('users');
  };

  const handleOrdersTabClick = () => {
    setActiveTab('orders');
  };

  const handleLogsTabClick = () => {
    if (!isAdmin) {
      return;
    }

    setActiveTab('logs');
  };

  const handleOpenCreateModeratorModal = () => {
    setEditState(null);
    setRemoveState(null);
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModeratorModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCloseEditModeratorModal = () => {
    setEditState(null);
  };

  const handleCloseRemoveModeratorModal = () => {
    setRemoveState(null);
  };

  const handleModalCardClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  if (!session) {
    return <Navigate to={ROUTES.signIn} replace />;
  }

  if (!isAdmin && !isModerator) {
    return <Navigate to={ROUTES.home} replace />;
  }

  return (
    <S.Section>
      <S.HeaderCard>
        <S.Title>Admin dashboard</S.Title>
        <S.Subtitle>{dashboardSubtitle}</S.Subtitle>

        <S.Tabs>
          {isAdmin ? (
            <S.TabButton type="button" $active={activeTab === 'users'} onClick={handleUsersTabClick}>
              All users
            </S.TabButton>
          ) : null}
          <S.TabButton type="button" $active={activeTab === 'orders'} onClick={handleOrdersTabClick}>
            All orders
          </S.TabButton>
          {isAdmin ? (
            <S.TabButton type="button" $active={activeTab === 'logs'} onClick={handleLogsTabClick}>
              Log usage
            </S.TabButton>
          ) : null}
        </S.Tabs>
      </S.HeaderCard>

      {isAdmin && activeTab === 'users' ? (
        <S.Panel>
          <S.HeadWrapper>
            <S.BlockTitle $isTitleWithActions>All users</S.BlockTitle>
            <S.CreateButton type="button" onClick={handleOpenCreateModeratorModal}>
            Create moderator
            </S.CreateButton>
          </S.HeadWrapper>

          {isLoading ? <S.EmptyText>Loading users...</S.EmptyText> : null}

          {!isLoading ? (
            <S.UserList>
              {users.map((user) => {
                const isModerator = user.role === USER_ROLES.moderator;
                const isPending = editingUserId === user.id;

                return (
                  <S.UserItem key={user.id}>
                    <S.UserRow>
                      <S.UserName>
                        {user.firstName} {user.lastName}
                      </S.UserName>
                      <S.RolePill $role={user.role}>{user.role}</S.RolePill>
                      <S.StatusBadge $active={user.isActive}>
                        {user.isActive ? 'active' : 'disabled'}
                      </S.StatusBadge>
                      <span>{user.email}</span>
                    </S.UserRow>

                    {isModerator ? (
                      <S.Actions>
                        <S.ActionButton
                          type="button"
                          data-user-id={user.id}
                          onClick={handleEditClick}
                          disabled={isPending}
                        >
                          Edit
                        </S.ActionButton>
                        <S.ActionButton
                          type="button"
                          $danger
                          data-user-id={user.id}
                          onClick={handleDeleteClick}
                          disabled={isPending}
                        >
                          Remove
                        </S.ActionButton>
                      </S.Actions>
                    ) : null}
                  </S.UserItem>
                );
              })}
            </S.UserList>
          ) : null}
        </S.Panel>
      ) : null}

      {activeTab === 'orders' ? (
        <S.Panel>
          <S.BlockTitle>All orders</S.BlockTitle>
          {orders.length === 0 ? (
            <S.EmptyText>No orders yet. This tab is ready for backend order integration.</S.EmptyText>
          ) : (
            <S.UserList>
              {orders.map((order) => (
                <S.UserItem key={order.id}>
                  <S.UserRow>
                    <S.UserName>{order.customerEmail}</S.UserName>
                    <S.RolePill $role="moderator">{order.status}</S.RolePill>
                    <span>${order.totalPrice.toFixed(2)}</span>
                  </S.UserRow>
                </S.UserItem>
              ))}
            </S.UserList>
          )}
        </S.Panel>
      ) : null}

      {isAdmin && activeTab === 'logs' ? (
        <S.Panel>
          <S.BlockTitle>Log usage</S.BlockTitle>
          <S.EmptyText>Usage logs module will be implemented later.</S.EmptyText>
        </S.Panel>
      ) : null}

      {isAdmin && isCreateModalOpen ? (
        <S.ModalOverlay role="presentation" onClick={handleCloseCreateModeratorModal}>
          <S.ModalCard
            role="dialog"
            aria-modal="true"
            aria-label="Create moderator dialog"
            onClick={handleModalCardClick}
          >
            <S.ModalHeader>
              <S.BlockTitle $isTitleWithActions>Create moderator</S.BlockTitle>
              <S.CloseButton type="button" onClick={handleCloseCreateModeratorModal}>
                Close
              </S.CloseButton>
            </S.ModalHeader>
            <S.Form onSubmit={handleCreateModeratorSubmit}>
              <S.Label>
                First name
                <S.Input value={firstName} onChange={handleCreateFirstNameChange} required />
              </S.Label>
              <S.Label>
                Last name
                <S.Input value={lastName} onChange={handleCreateLastNameChange} required />
              </S.Label>
              <S.Label>
                Email
                <S.Input type="email" value={email} onChange={handleCreateEmailChange} required />
              </S.Label>
              <S.Label>
                Temporary password
                <S.Input
                  type="password"
                  value={password}
                  onChange={handleCreatePasswordChange}
                  minLength={8}
                  required
                />
              </S.Label>
              <S.SubmitButton type="submit" disabled={isCreateSubmitting}>
                {isCreateSubmitting ? 'Creating...' : 'Create moderator'}
              </S.SubmitButton>
            </S.Form>
          </S.ModalCard>
        </S.ModalOverlay>
      ) : null}

      {isAdmin && editState ? (
        <S.ModalOverlay role="presentation" onClick={handleCloseEditModeratorModal}>
          <S.ModalCard
            role="dialog"
            aria-modal="true"
            aria-label="Edit moderator dialog"
            onClick={handleModalCardClick}
          >
            <S.ModalHeader>
              <S.BlockTitle $isTitleWithActions>Edit moderator</S.BlockTitle>
              <S.CloseButton type="button" onClick={handleCloseEditModeratorModal}>
                Close
              </S.CloseButton>
            </S.ModalHeader>
            <S.Form>
              <S.Label>
                First name
                <S.Input value={editState.firstName} onChange={handleEditFirstNameChange} />
              </S.Label>
              <S.Label>
                Last name
                <S.Input value={editState.lastName} onChange={handleEditLastNameChange} />
              </S.Label>
              <S.Label>
                Email
                <S.Input type="email" value={editState.email} onChange={handleEditEmailChange} />
              </S.Label>
              <S.InlineCheckboxLabel>
                Active
                <input type="checkbox" checked={editState.isActive} onChange={handleEditIsActiveChange} />
              </S.InlineCheckboxLabel>
            </S.Form>
            <S.ModalActions>
              <S.SubmitButton
                type="button"
                disabled={editingUserId === editState.userId}
                onClick={handleSaveEditClick}
              >
                {editingUserId === editState.userId ? 'Saving...' : 'Save'}
              </S.SubmitButton>
              <S.CloseButton type="button" onClick={handleCloseEditModeratorModal}>
                Cancel
              </S.CloseButton>
            </S.ModalActions>
          </S.ModalCard>
        </S.ModalOverlay>
      ) : null}

      {isAdmin && removeState ? (
        <S.ModalOverlay role="presentation" onClick={handleCloseRemoveModeratorModal}>
          <S.ModalCard
            role="dialog"
            aria-modal="true"
            aria-label="Remove moderator confirmation dialog"
            onClick={handleModalCardClick}
          >
            <S.ModalHeader>
              <S.BlockTitle $isTitleWithActions>Remove moderator</S.BlockTitle>
              <S.CloseButton type="button" onClick={handleCloseRemoveModeratorModal}>
                Close
              </S.CloseButton>
            </S.ModalHeader>
            <S.ModalBodyText>
              Are you sure you want to remove {removeState.fullName}? This action cannot be undone.
            </S.ModalBodyText>
            <S.ModalActions>
              <S.ActionButton
                type="button"
                $danger
                onClick={handleConfirmRemoveClick}
                disabled={editingUserId === removeState.userId}
              >
                {editingUserId === removeState.userId ? 'Removing...' : 'Remove moderator'}
              </S.ActionButton>
              <S.CloseButton type="button" onClick={handleCloseRemoveModeratorModal}>
                Cancel
              </S.CloseButton>
            </S.ModalActions>
          </S.ModalCard>
        </S.ModalOverlay>
      ) : null}
    </S.Section>
  );
};
