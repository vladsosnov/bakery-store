import { useEffect, useMemo, useState, type FC } from 'react';
import { toast } from 'sonner';

import { getAuthSession } from '@src/services/auth-session';
import { getMyOrders } from '@src/services/order-api';
import type { MyOrder } from '@src/types/order';
import { USER_ROLES } from '@src/types/user-role';
import { formatOrderDate } from '@src/utils/date';
import { toErrorMessage } from '@src/utils/error';
import * as S from './MyOrdersPage.styles';

export const MyOrdersPage: FC = () => {
  const session = useMemo(() => getAuthSession(), []);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<MyOrder[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!session || session.user.role !== USER_ROLES.customer) {
      setIsLoading(false);
      return;
    }

    const loadOrders = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMyOrders();
        setOrders(response.data);
      } catch (error) {
        const errorMessage = toErrorMessage(error, 'Failed to load your orders.');
        toast.error(errorMessage);
        setErrorMessage(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [session]);

  if (!session) {
    return (
      <S.Section>
        <S.Card>
          <S.Title>My orders</S.Title>
          <S.Subtitle>Please sign in to view your orders.</S.Subtitle>
        </S.Card>
      </S.Section>
    );
  }

  if (session.user.role !== USER_ROLES.customer) {
    return (
      <S.Section>
        <S.Card>
          <S.Title>My orders</S.Title>
          <S.Subtitle>Order history is available only for customer accounts.</S.Subtitle>
        </S.Card>
      </S.Section>
    );
  }

  if (isLoading) {
    return (
      <S.Section>
        <S.Card>
          <S.Title>My orders</S.Title>
          <S.Subtitle>Loading orders...</S.Subtitle>
        </S.Card>
      </S.Section>
    );
  }

  if (errorMessage) {
    return (
      <S.Section>
        <S.Card>
          <S.Title>My orders</S.Title>
          <S.Subtitle>{errorMessage}</S.Subtitle>
        </S.Card>
      </S.Section>
    );
  }

  return (
    <S.Section>
      <S.Card>
        <S.Title>My orders</S.Title>
        {orders.length === 0 ? (
          <S.Subtitle>You do not have any orders yet.</S.Subtitle>
        ) : (
          <S.OrderList>
            {orders.map((order) => (
              <S.OrderItem key={order.id}>
                <S.OrderHeader>
                  <S.Total>Order #{order.id.slice(-6)}</S.Total>
                  <S.Status>{order.status}</S.Status>
                </S.OrderHeader>
                <S.Subtitle>Placed: {formatOrderDate(order.createdAt)}</S.Subtitle>
                <S.Total>Total: ${order.totalPrice.toFixed(2)}</S.Total>
                <S.ItemList>
                  {order.items.map((item) => (
                    <S.Item key={`${order.id}-${item.productId}`}>
                      {item.name} x {item.quantity} - ${item.lineTotal.toFixed(2)}
                    </S.Item>
                  ))}
                </S.ItemList>
              </S.OrderItem>
            ))}
          </S.OrderList>
        )}
      </S.Card>
    </S.Section>
  );
};
