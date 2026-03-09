import { useEffect, useMemo, useState, type FC } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { ORDER_STATUS_OPTIONS, type AdminOrder, type AdminOrderStatus, type AdminUser } from '@src/types/admin';
import { getModeratorChatThreads } from '@src/services/chat-api';
import type { ChatThread } from '@src/types/chat';
import * as S from '@src/components/pages/admin-dashboard/AdminDashboardPage.styles';
import * as L from '@src/components/pages/admin-dashboard/tabs/LogsTab.styles';
import { toDailySeries, getDayKey } from './Tabs.utils';
import {
  getChatMessagesChartOptions,
  getOrdersChartOptions,
  getStatusChartOptions,
  getUsersChartOptions
} from './LogsTab.chart-options';

type LogsTabProps = {
  orders: AdminOrder[];
  users: AdminUser[];
};

export const LogsTab: FC<LogsTabProps> = ({ orders, users }) => {
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(true);
  const [chatLoadError, setChatLoadError] = useState<string | null>(null);
  const todayKey = new Date().toISOString().slice(0, 10);
  const ordersDaily = useMemo(() => toDailySeries(orders.map((order) => order.createdAt)), [orders]);
  const usersDaily = useMemo(
    () => toDailySeries(users.map((user) => user.createdAt).filter((createdAt): createdAt is string => Boolean(createdAt))),
    [users]
  );

  useEffect(() => {
    let isMounted = true;

    const loadChatMetrics = async () => {
      setIsChatLoading(true);
      setChatLoadError(null);

      try {
        const response = await getModeratorChatThreads();
        if (isMounted) {
          setChatThreads(response.data);
        }
      } catch {
        if (isMounted) {
          setChatThreads([]);
          setChatLoadError('Failed to load chat metrics.');
        }
      } finally {
        if (isMounted) {
          setIsChatLoading(false);
        }
      }
    };

    loadChatMetrics();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
  const todayOrders = orders.filter((order) => getDayKey(order.createdAt) === todayKey).length;
  const todayUsers = users.filter((user) => user.createdAt && getDayKey(user.createdAt) === todayKey).length;
  const statusCounts = ORDER_STATUS_OPTIONS.reduce<Record<AdminOrderStatus, number>>((acc, status) => {
    acc[status] = orders.filter((order) => order.status === status).length;
    return acc;
  }, { placed: 0, 'in progress': 0, 'in delivery': 0 });

  const totalChatMessages = chatThreads.reduce((acc, thread) => acc + thread.messages.length, 0);
  const activeConversations = chatThreads.filter((thread) => thread.unreadForSupport).length;
  const conversationsToday = chatThreads.filter((thread) => getDayKey(thread.lastMessageAt) === todayKey).length;
  const medianResponseTimeMinutes = useMemo(() => {
    const responseDurationsMs: number[] = [];

    chatThreads.forEach((thread) => {
      let pendingCustomerMessageAt: number | null = null;
      thread.messages.forEach((message) => {
        const currentMessageTime = new Date(message.createdAt).getTime();

        if (message.senderRole === 'customer') {
          pendingCustomerMessageAt = currentMessageTime;
          return;
        }
        if (message.senderRole === 'moderator' && pendingCustomerMessageAt) {
          responseDurationsMs.push(currentMessageTime - pendingCustomerMessageAt);
          pendingCustomerMessageAt = null;
        }
      });
    });

    if (responseDurationsMs.length === 0) {
      return null;
    }

    const sorted = responseDurationsMs.sort((left, right) => left - right);
    const middleIndex = Math.floor(sorted.length / 2);
    const medianMs =
      sorted.length % 2 === 0 ? (sorted[middleIndex - 1] + sorted[middleIndex]) / 2 : sorted[middleIndex];

    return Math.max(1, Math.round(medianMs / (60 * 1000)));
  }, [chatThreads]);
  const chatMessagesDaily = useMemo(
    () => toDailySeries(chatThreads.flatMap((thread) => thread.messages.map((message) => message.createdAt))),
    [chatThreads]
  );
  const ordersChartOptions = useMemo(() => getOrdersChartOptions(ordersDaily), [ordersDaily]);
  const usersChartOptions = useMemo(() => getUsersChartOptions(usersDaily), [usersDaily]);
  const statusChartOptions = useMemo(() => getStatusChartOptions(statusCounts), [statusCounts]);
  const chatMessagesChartOptions = useMemo(
    () => getChatMessagesChartOptions(chatMessagesDaily),
    [chatMessagesDaily]
  );

  return (
    <S.Panel>
      <S.BlockTitle>Log usage</S.BlockTitle>

      <L.MetricsGrid>
        <L.MetricCard>
          <L.MetricLabel>Total orders</L.MetricLabel>
          <L.MetricValue>{orders.length}</L.MetricValue>
        </L.MetricCard>
        <L.MetricCard>
          <L.MetricLabel>Orders today</L.MetricLabel>
          <L.MetricValue>{todayOrders}</L.MetricValue>
        </L.MetricCard>
        <L.MetricCard>
          <L.MetricLabel>Total revenue</L.MetricLabel>
          <L.MetricValue>${totalRevenue.toFixed(2)}</L.MetricValue>
        </L.MetricCard>
        <L.MetricCard>
          <L.MetricLabel>User registrations today</L.MetricLabel>
          <L.MetricValue>{todayUsers}</L.MetricValue>
        </L.MetricCard>
      </L.MetricsGrid>

      <L.Section>
        <L.SectionTitle>Orders activity (last 7 days)</L.SectionTitle>
        <L.ChartBox>
          <HighchartsReact highcharts={Highcharts} options={ordersChartOptions} />
        </L.ChartBox>
      </L.Section>

      <L.Section>
        <L.SectionTitle>User registration activity (last 7 days)</L.SectionTitle>
        <L.ChartBox>
          <HighchartsReact highcharts={Highcharts} options={usersChartOptions} />
        </L.ChartBox>
      </L.Section>

      <L.Section>
        <L.SectionTitle>Order pipeline status</L.SectionTitle>
        <L.ChartBox>
          <HighchartsReact highcharts={Highcharts} options={statusChartOptions} />
        </L.ChartBox>
      </L.Section>

      <L.Section>
        <L.SectionTitle>Chat activity</L.SectionTitle>
        {isChatLoading ? <L.PlaceholderText>Loading chat metrics...</L.PlaceholderText> : null}
        {chatLoadError ? <L.ErrorText>{chatLoadError}</L.ErrorText> : null}
        {!isChatLoading && !chatLoadError ? (
          <>
            <L.MetricsGrid>
              <L.MetricCard>
                <L.MetricLabel>Total chat messages</L.MetricLabel>
                <L.MetricValue>{totalChatMessages}</L.MetricValue>
              </L.MetricCard>
              <L.MetricCard>
                <L.MetricLabel>Active conversations</L.MetricLabel>
                <L.MetricValue>{activeConversations}</L.MetricValue>
              </L.MetricCard>
              <L.MetricCard>
                <L.MetricLabel>Conversations today</L.MetricLabel>
                <L.MetricValue>{conversationsToday}</L.MetricValue>
              </L.MetricCard>
              <L.MetricCard>
                <L.MetricLabel>Median response time</L.MetricLabel>
                <L.MetricValue>
                  {medianResponseTimeMinutes !== null ? `${medianResponseTimeMinutes} min` : 'No replies yet'}
                </L.MetricValue>
              </L.MetricCard>
            </L.MetricsGrid>

            <L.NestedSection>
              <L.SectionTitle>Messages activity (last 7 days)</L.SectionTitle>
              <L.ChartBox>
                <HighchartsReact highcharts={Highcharts} options={chatMessagesChartOptions} />
              </L.ChartBox>
            </L.NestedSection>
          </>
        ) : null}
      </L.Section>
    </S.Panel>
  );
};
