import type { Options, SeriesAreaOptions, SeriesColumnOptions, SeriesLineOptions, SeriesPieOptions } from 'highcharts';

import { ORDER_STATUS_OPTIONS, type AdminOrderStatus } from '@src/types/admin';
import { colors } from '@src/styles/colors';

type DailyPoint = {
  label: string;
  value: number;
};

const getCommonChartOptions = (): Options => ({
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
});

const getCartesianChartOptions = (categories: string[]): Options => ({
  xAxis: {
    categories,
    lineColor: colors.border,
    tickColor: colors.border
  },
  yAxis: {
    title: { text: undefined },
    allowDecimals: false,
    gridLineColor: colors.border
  }
});

export const getOrdersChartOptions = (ordersDaily: DailyPoint[]): Options => {
  const series: SeriesColumnOptions[] = [
    {
      type: 'column',
      data: ordersDaily.map((item) => item.value),
      color: colors.brown
    }
  ];

  return {
    ...getCommonChartOptions(),
    ...getCartesianChartOptions(ordersDaily.map((item) => item.label)),
    series,
    tooltip: {
      pointFormat: '<b>{point.y}</b> orders'
    }
  };
};

export const getUsersChartOptions = (usersDaily: DailyPoint[]): Options => {
  const series: SeriesLineOptions[] = [
    {
      type: 'line',
      data: usersDaily.map((item) => item.value),
      color: colors.accentGreen
    }
  ];

  return {
    ...getCommonChartOptions(),
    ...getCartesianChartOptions(usersDaily.map((item) => item.label)),
    series,
    tooltip: {
      pointFormat: '<b>{point.y}</b> registrations'
    }
  };
};

export const getStatusChartOptions = (statusCounts: Record<AdminOrderStatus, number>): Options => {
  const commonChartOptions = getCommonChartOptions();
  const series: SeriesPieOptions[] = [
    {
      type: 'pie',
      data: ORDER_STATUS_OPTIONS.map((status) => ({
        name: status,
        y: statusCounts[status]
      }))
    }
  ];

  return {
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
    series
  };
};

export const getChatMessagesChartOptions = (chatMessagesDaily: DailyPoint[]): Options => {
  const series: SeriesAreaOptions[] = [
    {
      type: 'area',
      data: chatMessagesDaily.map((item) => item.value),
      color: colors.accentGreen,
      fillOpacity: 0.2
    }
  ];

  return {
    ...getCommonChartOptions(),
    ...getCartesianChartOptions(chatMessagesDaily.map((item) => item.label)),
    series,
    tooltip: {
      pointFormat: '<b>{point.y}</b> messages'
    }
  };
};
