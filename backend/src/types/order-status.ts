export const ORDER_STATUSES = {
  placed: 'placed',
  inProgress: 'in progress',
  inDelivery: 'in delivery'
} as const;

export type OrderStatus = (typeof ORDER_STATUSES)[keyof typeof ORDER_STATUSES];

export const ORDER_STATUS_VALUES: OrderStatus[] = Object.values(ORDER_STATUSES);
