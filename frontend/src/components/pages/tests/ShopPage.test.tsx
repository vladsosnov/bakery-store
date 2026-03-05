import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { shopRoutes } from '@src/app/routes';
import { listProducts } from '@src/services/product-api';
import { ShopPage } from '../ShopPage';

jest.mock('@src/services/product-api', () => ({
  listProducts: jest.fn()
}));

const mockedListProducts = jest.mocked(listProducts);

const PRODUCTS_FIXTURE = [
  {
    _id: '1',
    name: 'Butter croissant',
    slug: 'butter-croissant',
    description: 'Flaky laminated pastry with cultured butter.',
    category: 'Pastries',
    price: 4.5,
    imageUrl: 'https://example.com/butter-croissant.jpg',
    tags: ['Best seller'],
    isAvailable: true,
    stock: 30
  },
  {
    _id: '2',
    name: 'Chocolate celebration cake',
    slug: 'chocolate-celebration-cake',
    description: 'Rich cocoa sponge with silky ganache layers.',
    category: 'Cakes',
    price: 42,
    imageUrl: 'https://example.com/chocolate-cake.jpg',
    tags: ['Party'],
    isAvailable: true,
    stock: 12
  },
  {
    _id: '3',
    name: 'Sourdough loaf',
    slug: 'sourdough-loaf',
    description: 'Naturally fermented bread with deep flavor.',
    category: 'Bread',
    price: 8,
    imageUrl: 'https://example.com/sourdough.jpg',
    tags: ['Bread', 'Artisan'],
    isAvailable: true,
    stock: 25
  },
  {
    _id: '4',
    name: 'Vegan cinnamon roll',
    slug: 'vegan-cinnamon-roll',
    description: 'Soft swirl pastry with cinnamon glaze.',
    category: 'Pastries',
    price: 5.5,
    imageUrl: 'https://example.com/cinnamon-roll.jpg',
    tags: ['New'],
    isAvailable: true,
    stock: 22
  }
];

describe('ShopPage', () => {
  beforeEach(() => {
    mockedListProducts.mockResolvedValue(PRODUCTS_FIXTURE);
  });

  afterEach(() => {
    mockedListProducts.mockReset();
  });

  it('renders filters, categories, and search', async () => {
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
    await screen.findByText(/butter croissant/i);
    expect(screen.getAllByRole('button', { name: /add to cart/i }).length).toBeGreaterThan(0);
  });

  it('filters products by search text', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ShopPage />
      </MemoryRouter>
    );

    await screen.findByText(/butter croissant/i);
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

    await screen.findByText(/butter croissant/i);
    expect(screen.getAllByLabelText(/in cart: 0/i).length).toBeGreaterThan(0);
    await user.click(screen.getAllByRole('button', { name: /add to cart/i })[0]);
    expect(screen.getByText(/added/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/in cart: 1/i)).toBeInTheDocument();
  });

  it('applies tag filter from url query', async () => {
    render(
      <MemoryRouter initialEntries={[shopRoutes.withTag('New')]}>
        <ShopPage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/vegan cinnamon roll/i)).toBeInTheDocument();
    expect(screen.queryByText(/butter croissant/i)).not.toBeInTheDocument();
  });

  it('applies bread tag filter from url query', async () => {
    render(
      <MemoryRouter initialEntries={[shopRoutes.withTag('Bread')]}>
        <ShopPage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/sourdough loaf/i)).toBeInTheDocument();
    expect(screen.queryByText(/chocolate celebration cake/i)).not.toBeInTheDocument();
  });
});
