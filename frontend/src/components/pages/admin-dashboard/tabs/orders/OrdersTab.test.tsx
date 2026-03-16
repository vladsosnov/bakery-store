import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { OrdersTab } from './OrdersTab';

const ORDERS_FIXTURE = [
  {
    id: 'order-1',
    customerEmail: 'john@bakery.local',
    customerName: 'John Doe',
    customerPhone: '+15550001122',
    status: 'placed' as const,
    note: 'Please call on arrival.',
    totalItems: 2,
    totalPrice: 16,
    createdAt: new Date().toISOString(),
    items: [
      {
        productId: 'p1',
        name: 'Sourdough loaf',
        quantity: 2,
        lineTotal: 16
      }
    ],
    deliveryAddress: {
      zip: '10001',
      street: '5th Avenue 10',
      city: 'New York'
    }
  },
  {
    id: 'order-2',
    customerEmail: 'anna@bakery.local',
    customerName: 'Anna Smith',
    customerPhone: '',
    status: 'in delivery' as const,
    note: '',
    totalItems: 1,
    totalPrice: 9,
    createdAt: new Date().toISOString(),
    items: [
      {
        productId: 'p2',
        name: 'Croissant',
        quantity: 1,
        lineTotal: 9
      }
    ],
    deliveryAddress: {
      zip: '20001',
      street: 'Main Street 1',
      city: 'Washington'
    }
  },
  {
    id: 'order-3',
    customerEmail: 'mia@bakery.local',
    customerName: 'Mia Stone',
    customerPhone: '',
    status: 'delivered' as const,
    note: '',
    totalItems: 1,
    totalPrice: 11,
    createdAt: new Date().toISOString(),
    items: [],
    deliveryAddress: {
      zip: '25001',
      street: 'Pearl Street 5',
      city: 'Boston'
    }
  },
  {
    id: 'order-4',
    customerEmail: 'kate@bakery.local',
    customerName: 'Kate P',
    customerPhone: '',
    status: 'canceled' as const,
    note: 'Out of stock.',
    totalItems: 1,
    totalPrice: 7,
    createdAt: new Date().toISOString(),
    items: [],
    deliveryAddress: {
      zip: '30001',
      street: 'Lake Street 2',
      city: 'Austin'
    }
  }
];

describe('OrdersTab', () => {
  it('renders orders and forwards interactions', async () => {
    const user = userEvent.setup();
    const onOrderStatusFilterChange = jest.fn();
    const onOrderSearchChange = jest.fn();
    const onOrderStatusSelectChange = jest.fn();
    const onOrderNoteChange = jest.fn();

    render(
      <OrdersTab
        orders={ORDERS_FIXTURE}
        filteredOrders={ORDERS_FIXTURE}
        isModerator={false}
        pendingOrderId={null}
        orderStatusFilter="all"
        orderSearchTerm=""
        onOrderStatusFilterChange={onOrderStatusFilterChange}
        onOrderSearchChange={onOrderSearchChange}
        onOrderStatusSelectChange={onOrderStatusSelectChange}
        onOrderNoteChange={onOrderNoteChange}
        getAllowedStatusOptions={() => ['placed', 'in progress', 'in delivery', 'delivered', 'canceled']}
        getDeliveryAddressText={(order) =>
          `${order.deliveryAddress.street}, ${order.deliveryAddress.city}, ${order.deliveryAddress.zip}`
        }
      />
    );

    expect(screen.getByRole('heading', { name: /active orders/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /in delivery/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /delivered/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /canceled/i })).toBeInTheDocument();
    expect(screen.getByText(/note: please call on arrival\./i)).toBeInTheDocument();

    await user.selectOptions(screen.getByRole('combobox', { name: /filter orders by status/i }), 'placed');
    await user.type(screen.getByRole('searchbox', { name: /search orders/i }), 'john');
    await user.type(screen.getByRole('textbox', { name: /status note for john@bakery.local/i }), 'Updated');
    await user.selectOptions(screen.getByRole('combobox', { name: /order status for john@bakery.local/i }), 'in progress');

    expect(onOrderStatusFilterChange).toHaveBeenCalled();
    expect(onOrderSearchChange).toHaveBeenCalled();
    expect(onOrderStatusSelectChange).toHaveBeenCalled();
    expect(onOrderNoteChange).toHaveBeenCalled();
  });

  it('shows no-match message when filtered list is empty', () => {
    render(
      <OrdersTab
        orders={ORDERS_FIXTURE}
        filteredOrders={[]}
        isModerator={true}
        pendingOrderId={null}
        orderStatusFilter="all"
        orderSearchTerm=""
        onOrderStatusFilterChange={jest.fn()}
        onOrderSearchChange={jest.fn()}
        onOrderStatusSelectChange={jest.fn()}
        onOrderNoteChange={jest.fn()}
        getAllowedStatusOptions={() => ['placed', 'in progress', 'in delivery', 'delivered', 'canceled']}
        getDeliveryAddressText={() => ''}
      />
    );

    expect(screen.getByText(/no orders match current filters\./i)).toBeInTheDocument();
  });
});
