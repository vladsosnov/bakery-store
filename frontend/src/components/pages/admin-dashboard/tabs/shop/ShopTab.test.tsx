import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ShopTab } from './ShopTab';

const PRODUCT = {
  _id: 'p1',
  name: 'Sourdough loaf',
  slug: 'sourdough-loaf',
  description: 'Fresh sourdough',
  category: 'Bread',
  price: 9,
  imageUrl: 'https://example.com/item.jpg',
  tags: ['New', 'Bread'],
  isAvailable: true,
  stock: 8
};

describe('ShopTab', () => {
  it('shows loading and empty states', () => {
    const { rerender } = render(
      <ShopTab
        isLoading
        products={[]}
        pendingProductId={null}
        onCreateProduct={jest.fn().mockResolvedValue(undefined)}
        onUpdateProduct={jest.fn().mockResolvedValue(undefined)}
        onDeleteProduct={jest.fn().mockResolvedValue(undefined)}
      />
    );

    expect(screen.getByText(/loading products/i)).toBeInTheDocument();

    rerender(
      <ShopTab
        isLoading={false}
        products={[]}
        pendingProductId={null}
        onCreateProduct={jest.fn().mockResolvedValue(undefined)}
        onUpdateProduct={jest.fn().mockResolvedValue(undefined)}
        onDeleteProduct={jest.fn().mockResolvedValue(undefined)}
      />
    );

    expect(screen.getByText(/no products yet\. add the first product above\./i)).toBeInTheDocument();
  });

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
    expect(screen.getByText(/200\s*\/\s*200\s*characters/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /add product/i }));

    await waitFor(() => {
      expect(onCreateProduct).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'x'.repeat(200)
        })
      );
    });
    expect(screen.getByLabelText(/^name$/i)).toHaveValue('');
  });

  it('disables create button when creating is pending', () => {
    render(
      <ShopTab
        isLoading={false}
        products={[]}
        pendingProductId="new"
        onCreateProduct={jest.fn().mockResolvedValue(undefined)}
        onUpdateProduct={jest.fn().mockResolvedValue(undefined)}
        onDeleteProduct={jest.fn().mockResolvedValue(undefined)}
      />
    );

    expect(screen.getByRole('button', { name: /creating/i })).toBeDisabled();
  });

  it('supports product quick actions (disable/enable and delete)', async () => {
    const user = userEvent.setup();
    const onUpdateProduct = jest.fn().mockResolvedValue(undefined);
    const onDeleteProduct = jest.fn().mockResolvedValue(undefined);

    const { rerender } = render(
      <ShopTab
        isLoading={false}
        products={[PRODUCT]}
        pendingProductId={null}
        onCreateProduct={jest.fn().mockResolvedValue(undefined)}
        onUpdateProduct={onUpdateProduct}
        onDeleteProduct={onDeleteProduct}
      />
    );

    await user.click(screen.getByRole('button', { name: /^disable$/i }));
    expect(onUpdateProduct).toHaveBeenCalledWith('p1', { isAvailable: false });

    await user.click(screen.getByRole('button', { name: /^delete$/i }));
    expect(onDeleteProduct).toHaveBeenCalledWith('p1');

    rerender(
      <ShopTab
        isLoading={false}
        products={[{ ...PRODUCT, _id: 'p2', isAvailable: false }]}
        pendingProductId={null}
        onCreateProduct={jest.fn().mockResolvedValue(undefined)}
        onUpdateProduct={onUpdateProduct}
        onDeleteProduct={onDeleteProduct}
      />
    );

    await user.click(screen.getByRole('button', { name: /^enable$/i }));
    expect(onUpdateProduct).toHaveBeenCalledWith('p2', { isAvailable: true });
  });

  it('edits product and submits update payload', async () => {
    const user = userEvent.setup();
    const onUpdateProduct = jest.fn().mockResolvedValue(undefined);

    render(
      <ShopTab
        isLoading={false}
        products={[PRODUCT]}
        pendingProductId={null}
        onCreateProduct={jest.fn().mockResolvedValue(undefined)}
        onUpdateProduct={onUpdateProduct}
        onDeleteProduct={jest.fn().mockResolvedValue(undefined)}
      />
    );

    await user.click(screen.getByRole('button', { name: /^edit$/i }));
    const editForm = screen.getByRole('form', { name: /edit product form sourdough loaf/i });
    const editDescriptionInput = within(editForm).getByRole('textbox', { name: /description/i });
    await user.clear(editDescriptionInput);
    await user.type(editDescriptionInput, ' Updated description ');
    await user.clear(within(editForm).getByRole('textbox', { name: /^tags$/i }));
    await user.type(within(editForm).getByRole('textbox', { name: /^tags$/i }), 'Bread, New,  ');
    await user.click(within(editForm).getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(onUpdateProduct).toHaveBeenCalledWith(
        'p1',
        expect.objectContaining({
          description: 'Updated description',
          tags: ['Bread', 'New']
        })
      );
    });

    expect(screen.queryByRole('button', { name: /save changes/i })).not.toBeInTheDocument();
  });

  it('keeps edit form open when update fails and supports cancel', async () => {
    const user = userEvent.setup();
    const onUpdateProduct = jest.fn().mockRejectedValue(new Error('network'));

    render(
      <ShopTab
        isLoading={false}
        products={[PRODUCT]}
        pendingProductId={null}
        onCreateProduct={jest.fn().mockResolvedValue(undefined)}
        onUpdateProduct={onUpdateProduct}
        onDeleteProduct={jest.fn().mockResolvedValue(undefined)}
      />
    );

    await user.click(screen.getByRole('button', { name: /^edit$/i }));
    const editForm = screen.getByRole('form', { name: /edit product form sourdough loaf/i });
    await user.click(within(editForm).getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(onUpdateProduct).toHaveBeenCalledTimes(1);
    });
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^cancel$/i }));
    expect(screen.queryByRole('button', { name: /save changes/i })).not.toBeInTheDocument();
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

  it('does not set tooltip for short description', () => {
    render(
      <ShopTab
        isLoading={false}
        products={[PRODUCT]}
        pendingProductId={null}
        onCreateProduct={jest.fn().mockResolvedValue(undefined)}
        onUpdateProduct={jest.fn().mockResolvedValue(undefined)}
        onDeleteProduct={jest.fn().mockResolvedValue(undefined)}
      />
    );

    const preview = screen.getByText('Description: Fresh sourdough');
    expect(preview).not.toHaveAttribute('title');
  });
});
