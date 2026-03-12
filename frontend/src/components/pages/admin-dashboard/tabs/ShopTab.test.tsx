import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ShopTab } from './ShopTab';

describe('ShopTab', () => {
  it('limits create description to 200 chars and submits product', async () => {
    const user = userEvent.setup();
    const onCreateProduct = jest.fn().mockResolvedValue(undefined);

    render(
      <ShopTab
        isLoading={false}
        products={[]}
        pendingProductId={null}
        onCreateProduct={onCreateProduct}
        onUpdateProduct={jest.fn().mockResolvedValue(undefined)}
        onDeleteProduct={jest.fn().mockResolvedValue(undefined)}
      />
    );

    await user.type(screen.getByLabelText(/^name$/i), 'Sourdough loaf');
    await user.type(screen.getByLabelText(/^category$/i), 'Bread');
    await user.type(screen.getByLabelText(/^price$/i), '8');
    await user.type(screen.getByLabelText(/^stock$/i), '5');
    await user.type(screen.getByLabelText(/image url/i), 'https://example.com/sourdough.jpg');
    await user.type(screen.getByLabelText(/description/i), 'x'.repeat(220));
    await user.click(screen.getByRole('button', { name: /add product/i }));

    await waitFor(() => {
      expect(onCreateProduct).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'x'.repeat(200)
        })
      );
    });
    expect(screen.getByText('200/200 characters')).toBeInTheDocument();
  });

  it('shows tooltip for long description in product list', () => {
    const longDescription = 'A'.repeat(210);

    render(
      <ShopTab
        isLoading={false}
        products={[
          {
            _id: 'p1',
            name: 'Long Description Product',
            slug: 'long-description-product',
            description: longDescription,
            category: 'Bread',
            price: 9,
            imageUrl: 'https://example.com/item.jpg',
            tags: ['New'],
            isAvailable: true,
            stock: 8
          }
        ]}
        pendingProductId={null}
        onCreateProduct={jest.fn().mockResolvedValue(undefined)}
        onUpdateProduct={jest.fn().mockResolvedValue(undefined)}
        onDeleteProduct={jest.fn().mockResolvedValue(undefined)}
      />
    );

    const preview = screen.getByText(`Description: ${'A'.repeat(200)}...`);
    expect(preview).toHaveAttribute('title', longDescription);
  });
});
