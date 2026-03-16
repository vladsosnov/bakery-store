import type { ChangeEventHandler, FC } from 'react';

import { ORDER_NOTE_MAX_LENGTH } from '@src/constants/validation';
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
  onOrderNoteChange: ChangeEventHandler<HTMLTextAreaElement>;
  getAllowedStatusOptions: (status: AdminOrderStatus) => readonly AdminOrderStatus[];
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
  onOrderNoteChange,
  getAllowedStatusOptions,
  getDeliveryAddressText
}) => {
  const activeOrders = filteredOrders.filter(
    (order) => order.status !== 'in delivery' && order.status !== 'delivered' && order.status !== 'canceled'
  );
  const inDeliveryOrders = filteredOrders.filter((order) => order.status === 'in delivery');
  const deliveredOrders = filteredOrders.filter((order) => order.status === 'delivered');
  const canceledOrders = filteredOrders.filter((order) => order.status === 'canceled');

  const renderOrderList = (list: AdminOrder[]) => {
    if (list.length === 0) {
      return <S.EmptyText>No orders in this section.</S.EmptyText>;
    }

    return (
      <S.UserList>
        {list.map((order) => (
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
              {order.note.trim() !== '' ? <S.MutedText>Note: {order.note}</S.MutedText> : null}
              <S.MutedText>
                Phone: {order.customerPhone.trim() !== '' ? order.customerPhone : 'Phone is not set'}
              </S.MutedText>
              <S.Label>
                Status note for customer
                <S.TextArea
                  data-order-id={order.id}
                  value={order.note}
                  onChange={onOrderNoteChange}
                  aria-label={`Status note for ${order.customerEmail}`}
                  placeholder="Optional note visible to customer"
                  maxLength={ORDER_NOTE_MAX_LENGTH}
                  disabled={pendingOrderId === order.id}
                />
              </S.Label>
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
                {getAllowedStatusOptions(order.status).map((status) => (
                  <option key={`${order.id}-${status}`} value={status}>
                    {status}
                  </option>
                ))}
              </S.StatusSelect>
            </S.Actions>
          </S.UserItem>
        ))}
      </S.UserList>
    );
  };

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
        <S.SectionList>
          <S.Subsection>
            <S.BlockTitle>Active orders</S.BlockTitle>
            {renderOrderList(activeOrders)}
          </S.Subsection>
          <S.Subsection>
            <S.BlockTitle>In delivery</S.BlockTitle>
            {renderOrderList(inDeliveryOrders)}
          </S.Subsection>
          <S.Subsection>
            <S.BlockTitle>Delivered</S.BlockTitle>
            {renderOrderList(deliveredOrders)}
          </S.Subsection>
          <S.Subsection>
            <S.BlockTitle>Canceled</S.BlockTitle>
            {renderOrderList(canceledOrders)}
          </S.Subsection>
        </S.SectionList>
      )}
    </S.Panel>
  );
};
