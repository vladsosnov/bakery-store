import { useMemo, type FC } from 'react';
import Highcharts, { type Options } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { ORDER_STATUS_OPTIONS, type AdminOrder, type AdminOrderStatus, type AdminUser } from '@src/types/admin';
import * as S from '@src/components/pages/admin-dashboard/AdminDashboardPage.styles';
import * as L from '@src/components/pages/admin-dashboard/tabs/LogsTab.styles';
import { colors } from '@src/styles/colors';
import { toDailySeries, getDayKey } from './Tabs.utils';

type LogsTabProps = {
  orders: AdminOrder[];
  users: AdminUser[];
};

export const LogsTab: FC<LogsTabProps> = ({ orders, users }) => {
  const todayKey = new Date().toISOString().slice(0, 10);
  const ordersDaily = useMemo(() => toDailySeries(orders.map((order) => order.createdAt)), [orders]);
  const usersDaily = useMemo(
    () => toDailySeries(users.map((user) => user.createdAt).filter((createdAt): createdAt is string => Boolean(createdAt))),
    [users]
  );
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
  const todayOrders = orders.filter((order) => getDayKey(order.createdAt) === todayKey).length;
  const todayUsers = users.filter((user) => user.createdAt && getDayKey(user.createdAt) === todayKey).length;
  const statusCounts = ORDER_STATUS_OPTIONS.reduce<Record<AdminOrderStatus, number>>((acc, status) => {
    acc[status] = orders.filter((order) => order.status === status).length;
    return acc;
  }, { placed: 0, 'in progress': 0, 'in delivery': 0 });
  
  const commonChartOptions: Options = {
    chart: {
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'inherit'
      }
    },
    accessibility: {
      enabled: false
    },
    credits: { enabled: false },
    legend: { enabled: false },
    title: { text: undefined }
  };

  const ordersChartOptions: Options = {
    ...commonChartOptions,
    xAxis: {
      categories: ordersDaily.map((item) => item.label),
      lineColor: colors.border,
      tickColor: colors.border
    },
    yAxis: {
      title: { text: undefined },
      allowDecimals: false,
      gridLineColor: colors.border
    },
    series: [
      {
        type: 'column',
        data: ordersDaily.map((item) => item.value),
        color: colors.brown
      }
    ],
    tooltip: {
      pointFormat: '<b>{point.y}</b> orders'
    }
  };

  const usersChartOptions: Options = {
    ...commonChartOptions,
    xAxis: {
      categories: usersDaily.map((item) => item.label),
      lineColor: colors.border,
      tickColor: colors.border
    },
    yAxis: {
      title: { text: undefined },
      allowDecimals: false,
      gridLineColor: colors.border
    },
    series: [
      {
        type: 'line',
        data: usersDaily.map((item) => item.value),
        color: colors.accentGreen
      }
    ],
    tooltip: {
      pointFormat: '<b>{point.y}</b> registrations'
    }
  };
  
  const statusChartOptions: Options = {
    ...commonChartOptions,
    chart: {
      ...(commonChartOptions.chart ?? {}),
      type: 'pie'
    },
    tooltip: {
      pointFormat: '<b>{point.y}</b> ({point.percentage:.1f}%)'
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: true,
          format: '{point.name}: {point.y}'
        }
      }
    },
    series: [
      {
        type: 'pie',
        data: ORDER_STATUS_OPTIONS.map((status) => ({
          name: status,
          y: statusCounts[status]
        }))
      }
    ]
  };

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
        <L.PlaceholderText>
          Real-time chat metrics are planned next. This block will show message volume, active conversations,
          and median response time.
        </L.PlaceholderText>
      </L.Section>
    </S.Panel>
  );
};
