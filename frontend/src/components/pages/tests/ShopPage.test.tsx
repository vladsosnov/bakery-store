import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { shopRoutes } from '../../../app/routes';
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
