import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ShopPage } from '../ShopPage';

describe('ShopPage', () => {
  it('renders filters, categories, and search', () => {
    render(<ShopPage />);

    expect(screen.getByRole('heading', { name: /shop/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /filters/i })).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: /search products/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cakes' })).toBeInTheDocument();
  });

  it('filters products by search text', async () => {
    const user = userEvent.setup();
    render(<ShopPage />);

    await user.type(screen.getByRole('searchbox', { name: /search products/i }), 'sourdough');

    expect(screen.getByText(/sourdough loaf/i)).toBeInTheDocument();
    expect(screen.queryByText(/butter croissant/i)).not.toBeInTheDocument();
  });
});
