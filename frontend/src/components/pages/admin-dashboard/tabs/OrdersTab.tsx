import type { ChangeEventHandler, FC } from 'react';

import {
  ORDER_STATUS_OPTIONS,
  type AdminOrder,
  type AdminOrderStatus
} from '@src/types/admin';
import * as S from '@src/components/pages/admin-dashboard/AdminDashboardPage.styles';

type OrdersTabProps = {
  orders: AdminOrder[];
  filteredOrders: AdminOrder[];
  isModerator: boolean;
  pendingOrderId: string | null;
  orderStatusFilter: 'all' | AdminOrderStatus;
  orderSearchTerm: string;
  onOrderStatusFilterChange: ChangeEventHandler<HTMLSelectElement>;
  onOrderSearchChange: ChangeEventHandler<HTMLInputElement>;
  onOrderStatusSelectChange: ChangeEventHandler<HTMLSelectElement>;
  getDeliveryAddressText: (order: AdminOrder) => string;
};

export const OrdersTab: FC<OrdersTabProps> = ({
  orders,
  filteredOrders,
  isModerator,
  pendingOrderId,
  orderStatusFilter,
  orderSearchTerm,
  onOrderStatusFilterChange,
  onOrderSearchChange,
  onOrderStatusSelectChange,
  getDeliveryAddressText
}) => {
  return (
    <S.Panel>
      <S.BlockTitle>All orders</S.BlockTitle>
      <S.OrdersFilterRow>
        <S.StatusSelect
          value={orderStatusFilter}
          onChange={onOrderStatusFilterChange}
          aria-label="Filter orders by status"
        >
          <option value="all">All statuses</option>
          {ORDER_STATUS_OPTIONS.map((status) => (
            <option key={`filter-${status}`} value={status}>
              {status}
            </option>
          ))}
        </S.StatusSelect>
        <S.SearchInput
          type="search"
          value={orderSearchTerm}
          onChange={onOrderSearchChange}
          placeholder="Search by customer or order #"
          aria-label="Search orders"
        />
      </S.OrdersFilterRow>

      {filteredOrders.length === 0 ? (
        <S.EmptyText>
          {orders.length === 0 ? 'No orders yet.' : 'No orders match current filters.'}
        </S.EmptyText>
      ) : (
        <S.UserList>
          {filteredOrders.map((order) => (
            <S.UserItem key={order.id}>
              <S.UserRow>
                <S.UserName>{order.customerName}</S.UserName>
                <span>Order #{order.id.slice(-6)}</span>
                <span>{order.customerEmail}</span>
                {isModerator ? null : <S.RolePill $role="moderator">{order.status}</S.RolePill>}
                <span>{order.totalItems} items</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </S.UserRow>
              <S.OrderDetails>
                <S.MutedText>Delivery: {getDeliveryAddressText(order)}</S.MutedText>
                <S.MutedText>
                  Phone: {order.customerPhone.trim() !== '' ? order.customerPhone : 'Phone is not set'}
                </S.MutedText>
                <S.OrderItemList>
                  {order.items.map((item) => (
                    <S.OrderItem key={`${order.id}-${item.productId}`}>
                      {item.name} x {item.quantity} - ${item.lineTotal.toFixed(2)}
                    </S.OrderItem>
                  ))}
                </S.OrderItemList>
              </S.OrderDetails>
              <S.Actions>
                <S.StatusSelect
                  data-order-id={order.id}
                  value={order.status}
                  onChange={onOrderStatusSelectChange}
                  disabled={pendingOrderId === order.id}
                  aria-label={`Order status for ${order.customerEmail}`}
                >
                  {ORDER_STATUS_OPTIONS.map((status) => (
                    <option key={`${order.id}-${status}`} value={status}>
                      {status}
                    </option>
                  ))}
                </S.StatusSelect>
              </S.Actions>
            </S.UserItem>
          ))}
        </S.UserList>
      )}
    </S.Panel>
  );
};
