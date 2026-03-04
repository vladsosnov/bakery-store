import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { shopRoutes } from '@src/app/routes';
import { ShopPage } from '../ShopPage';

describe('ShopPage', () => {
  it('renders filters, categories, and search', () => {
    render(
      <MemoryRouter>
        <ShopPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /shop/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /filters/i })).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: /search products/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cakes' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /add to cart/i }).length).toBeGreaterThan(0);
  });

  it('filters products by search text', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ShopPage />
      </MemoryRouter>
    );

    await user.type(screen.getByRole('searchbox', { name: /search products/i }), 'sourdough');

    expect(screen.getByText(/sourdough loaf/i)).toBeInTheDocument();
    expect(screen.queryByText(/butter croissant/i)).not.toBeInTheDocument();
  });

  it('increments item quantity near add to cart button', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ShopPage />
      </MemoryRouter>
    );

    expect(screen.getAllByLabelText(/in cart: 0/i).length).toBeGreaterThan(0);
    await user.click(screen.getAllByRole('button', { name: /add to cart/i })[0]);
    expect(screen.getByText(/added/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/in cart: 1/i)).toBeInTheDocument();
  });

  it('applies tag filter from url query', () => {
    render(
      <MemoryRouter initialEntries={[shopRoutes.withTag('New')]}>
        <ShopPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/vegan cinnamon roll/i)).toBeInTheDocument();
    expect(screen.queryByText(/butter croissant/i)).not.toBeInTheDocument();
  });

  it('applies bread tag filter from url query', () => {
    render(
      <MemoryRouter initialEntries={[shopRoutes.withTag('Bread')]}>
        <ShopPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/sourdough loaf/i)).toBeInTheDocument();
    expect(screen.queryByText(/chocolate celebration cake/i)).not.toBeInTheDocument();
  });
});
