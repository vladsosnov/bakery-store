import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FC,
  type MouseEvent
} from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

import { ROUTES } from '@src/app/routes';
import {
  getAdminOrders,
  getAdminUsers,
  updateAdminOrderStatus
} from '@src/services/admin-api';
import { CreateModeratorModal } from '@src/components/modals/CreateModeratorModal';
import { EditModeratorModal } from '@src/components/modals/EditModeratorModal';
import { RemoveModeratorModal } from '@src/components/modals/RemoveModeratorModal';
import { LogsTab } from '@src/components/pages/admin-dashboard/tabs/LogsTab';
import { OrdersTab } from '@src/components/pages/admin-dashboard/tabs/OrdersTab';
import { UsersTab } from '@src/components/pages/admin-dashboard/tabs/UsersTab';
import { getAuthSession } from '@src/services/auth-session';
import { USER_ROLES } from '@src/types/user-role';
import type { AdminOrder, AdminOrderStatus, AdminUser } from '@src/types/admin';
import { toErrorMessage } from '@src/utils/error';
import * as S from './AdminDashboardPage.styles';

type AdminTab = 'users' | 'orders' | 'logs';
const ORDER_STATUS_FLOW: readonly AdminOrderStatus[] = ['placed', 'in progress', 'in delivery'];

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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedModeratorForEdit, setSelectedModeratorForEdit] = useState<AdminUser | null>(null);
  const [selectedModeratorForRemove, setSelectedModeratorForRemove] = useState<AdminUser | null>(null);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | AdminOrderStatus>('all');
  const [orderSearchTerm, setOrderSearchTerm] = useState('');

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
      toast.error(toErrorMessage(error, 'Failed to load admin dashboard.'));
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!session || (!isAdmin && !isModerator)) {
      setIsLoading(false);
      return;
    }

    loadDashboardData();
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
        setSelectedModeratorForEdit(null);
        setSelectedModeratorForRemove(null);
      }
    };

    if (isCreateModalOpen || selectedModeratorForEdit || selectedModeratorForRemove) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCreateModalOpen, selectedModeratorForEdit, selectedModeratorForRemove]);

  const handleEditClick = (event: MouseEvent<HTMLButtonElement>) => {
    const userId = event.currentTarget.dataset.userId;
    if (!userId) {
      return;
    }

    const user = users.find((existingUser) => existingUser.id === userId);
    if (!user) {
      return;
    }

    setSelectedModeratorForRemove(null);
    setSelectedModeratorForEdit(user);
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

    setSelectedModeratorForEdit(null);
    setSelectedModeratorForRemove(user);
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

  const handleOrderStatusChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    const orderId = event.currentTarget.dataset.orderId;
    if (!orderId) {
      return;
    }

    const nextStatus = event.target.value as AdminOrderStatus;
    const order = orders.find((existingOrder) => existingOrder.id === orderId);
    if (!order) {
      return;
    }
    if (ORDER_STATUS_FLOW.indexOf(nextStatus) < ORDER_STATUS_FLOW.indexOf(order.status)) {
      toast.error('Order status can only move forward.');
      return;
    }

    setPendingOrderId(orderId);
    try {
      const response = await updateAdminOrderStatus(orderId, nextStatus);
      setOrders((prev) => {
        return prev.map((order) => {
          if (order.id !== orderId) {
            return order;
          }

          return {
            ...order,
            status: response.data.status
          };
        });
      });
      toast.success('Order status updated.');
    } catch (error) {
      toast.error(toErrorMessage(error, 'Failed to update order status.'));
    } finally {
      setPendingOrderId(null);
    }
  };

  const getDeliveryAddressText = (order: AdminOrder) => {
    const parts = [order.deliveryAddress.street, order.deliveryAddress.city, order.deliveryAddress.zip].filter(
      (value) => value.trim() !== ''
    );

    return parts.length > 0 ? parts.join(', ') : 'Address is not set';
  };

  const getAllowedStatusOptions = (status: AdminOrderStatus) => {
    return ORDER_STATUS_FLOW.slice(ORDER_STATUS_FLOW.indexOf(status));
  };

  const filteredOrders = useMemo(() => {
    const normalizedSearch = orderSearchTerm.trim().toLowerCase();

    return orders.filter((order) => {
      if (orderStatusFilter !== 'all' && order.status !== orderStatusFilter) {
        return false;
      }

      if (normalizedSearch === '') {
        return true;
      }

      const orderNumber = order.id.slice(-6).toLowerCase();
      const fullOrderId = order.id.toLowerCase();
      const customerName = order.customerName.toLowerCase();

      return (
        customerName.includes(normalizedSearch) ||
        orderNumber.includes(normalizedSearch) ||
        fullOrderId.includes(normalizedSearch)
      );
    });
  }, [orders, orderSearchTerm, orderStatusFilter]);

  const handleLogsTabClick = () => {
    if (!isAdmin) {
      return;
    }

    setActiveTab('logs');
  };

  const handleOpenCreateModeratorModal = () => {
    setSelectedModeratorForEdit(null);
    setSelectedModeratorForRemove(null);
    setIsCreateModalOpen(true);
  };

  const handleModeratorCreated = (user: AdminUser) => {
    setUsers((prev) => [user, ...prev]);
    setIsCreateModalOpen(false);
  };

  const handleModeratorUpdated = (user: AdminUser) => {
    setUsers((prev) => prev.map((existingUser) => (existingUser.id === user.id ? user : existingUser)));
    setSelectedModeratorForEdit(null);
  };

  const handleModeratorRemoved = (userId: string) => {
    setUsers((prev) => prev.filter((existingUser) => existingUser.id !== userId));
    setSelectedModeratorForRemove(null);
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
        <UsersTab
          isLoading={isLoading}
          users={users}
          onOpenCreateModeratorModal={handleOpenCreateModeratorModal}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
        />
      ) : null}

      {activeTab === 'orders' ? (
        <OrdersTab
          orders={orders}
          filteredOrders={filteredOrders}
          isModerator={isModerator}
          pendingOrderId={pendingOrderId}
          orderStatusFilter={orderStatusFilter}
          orderSearchTerm={orderSearchTerm}
          onOrderStatusFilterChange={(e) => setOrderStatusFilter(e.target.value as AdminOrderStatus)}
          onOrderSearchChange={(e) => setOrderSearchTerm(e.target.value)}
          onOrderStatusSelectChange={(e) => handleOrderStatusChange(e)}
          getAllowedStatusOptions={getAllowedStatusOptions}
          getDeliveryAddressText={getDeliveryAddressText}
        />
      ) : null}

      {isAdmin && activeTab === 'logs' ? (
        <LogsTab
          orders={orders}
          users={users}
        />
      ) : null}

      <CreateModeratorModal
        isOpen={isAdmin && isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={handleModeratorCreated}
      />

      <EditModeratorModal
        isOpen={Boolean(isAdmin && selectedModeratorForEdit)}
        moderator={selectedModeratorForEdit}
        onClose={() => setSelectedModeratorForEdit(null)}
        onUpdated={handleModeratorUpdated}
      />

      <RemoveModeratorModal
        isOpen={Boolean(isAdmin && selectedModeratorForRemove)}
        moderator={selectedModeratorForRemove}
        onClose={() => setSelectedModeratorForRemove(null)}
        onRemoved={handleModeratorRemoved}
      />
    </S.Section>
  );
};
