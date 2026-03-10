import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'sonner';

import { shopRoutes } from '@src/app/routes';
import { addToCart, fetchCart } from '@src/services/cart-api';
import { getAuthSession } from '@src/services/auth-session';
import { listProducts } from '@src/services/product-api';
import { ShopPage } from '../ShopPage';

jest.mock('@src/services/product-api', () => ({
  listProducts: jest.fn()
}));
jest.mock('@src/services/cart-api', () => ({
  fetchCart: jest.fn(),
  addToCart: jest.fn()
}));
jest.mock('@src/services/auth-session', () => ({
  getAuthSession: jest.fn()
}));
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn()
  }
}));

const mockedListProducts = jest.mocked(listProducts);
const mockedFetchCart = jest.mocked(fetchCart);
const mockedAddToCart = jest.mocked(addToCart);
const mockedGetAuthSession = jest.mocked(getAuthSession);
const mockedToastError = jest.mocked(toast.error);

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
    mockedGetAuthSession.mockReturnValue({
      accessToken: 'token',
      user: {
        id: 'u1',
        firstName: 'Vlad',
        lastName: 'Sosnov',
        email: 'vlad@bakery.local',
        role: 'customer'
      }
    });
    mockedFetchCart.mockResolvedValue({
      data: {
        items: [],
        totalItems: 0,
        totalPrice: 0
      }
    });
    mockedAddToCart.mockResolvedValue({
      data: {
        items: [
          {
            productId: '1',
            name: 'Butter croissant',
            imageUrl: 'https://example.com/butter-croissant.jpg',
            price: 4.5,
            quantity: 1,
            availableStock: 10,
            lineTotal: 4.5
          }
        ],
        totalItems: 1,
        totalPrice: 4.5
      }
    });
  });

  afterEach(() => {
    mockedListProducts.mockReset();
    mockedFetchCart.mockReset();
    mockedAddToCart.mockReset();
    mockedGetAuthSession.mockReset();
    mockedToastError.mockReset();
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

  it('shows empty state when filters produce no results', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ShopPage />
      </MemoryRouter>
    );

    await screen.findByText(/butter croissant/i);
    await user.type(screen.getByRole('searchbox', { name: /search products/i }), 'no-such-item');

    expect(screen.getByText(/no results\. try changing filters or search query\./i)).toBeInTheDocument();
  });

  it('shows no products state when catalog is empty', async () => {
    mockedListProducts.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <ShopPage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/no products yet\. a moderator will add items soon\./i)).toBeInTheDocument();
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
    expect(screen.getByLabelText(/in cart: 1/i)).toBeInTheDocument();
  });

  it('shows loading state before products are resolved', async () => {
    let resolveProducts: ((value: typeof PRODUCTS_FIXTURE) => void) | undefined;
    mockedListProducts.mockReturnValue(
      new Promise((resolve) => {
        resolveProducts = resolve;
      })
    );

    render(
      <MemoryRouter>
        <ShopPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading products/i)).toBeInTheDocument();

    resolveProducts?.(PRODUCTS_FIXTURE);
    expect(await screen.findByText(/butter croissant/i)).toBeInTheDocument();
  });

  it('shows load error state when products request fails', async () => {
    mockedListProducts.mockRejectedValue(new Error('network'));

    render(
      <MemoryRouter>
        <ShopPage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/unable to load products list right now\./i)).toBeInTheDocument();
    expect(mockedToastError).toHaveBeenCalledWith('Failed to load products. Please try again.');
  });

  it('shows guest toast when trying to add to cart while signed out', async () => {
    const user = userEvent.setup();
    mockedGetAuthSession.mockReturnValue(null);

    render(
      <MemoryRouter>
        <ShopPage />
      </MemoryRouter>
    );

    await screen.findByText(/butter croissant/i);
    await user.click(screen.getAllByRole('button', { name: /add to cart/i })[0]);

    expect(mockedAddToCart).not.toHaveBeenCalled();
    expect(mockedToastError).toHaveBeenCalledWith('Sign in first to add products to your cart.');
  });

  it('shows toast when add to cart request fails', async () => {
    const user = userEvent.setup();
    mockedAddToCart.mockRejectedValue(new Error('network'));

    render(
      <MemoryRouter>
        <ShopPage />
      </MemoryRouter>
    );

    await screen.findByText(/butter croissant/i);
    await user.click(screen.getAllByRole('button', { name: /add to cart/i })[0]);

    await waitFor(() => {
      expect(mockedToastError).toHaveBeenCalledWith('Failed to add product to cart.');
    });
  });

  it('applies tag filter from url query', async () => {
    render(
      <MemoryRouter initialEntries={[shopRoutes.withTag('New')]}>
        <ShopPage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/vegan cinnamon roll/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText(/butter croissant/i)).not.toBeInTheDocument();
    });
  });

  it('applies bread tag filter from url query', async () => {
    render(
      <MemoryRouter initialEntries={[shopRoutes.withTag('Bread')]}>
        <ShopPage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/sourdough loaf/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText(/chocolate celebration cake/i)).not.toBeInTheDocument();
    });
  });

  it('falls back to all filters when url contains unsupported values', async () => {
    render(
      <MemoryRouter initialEntries={['/shop?category=Unknown&tag=Unknown']}>
        <ShopPage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/butter croissant/i)).toBeInTheDocument();
    expect(screen.getByText(/chocolate celebration cake/i)).toBeInTheDocument();
  });

  it('disables add to cart for moderator users', async () => {
    mockedGetAuthSession.mockReturnValue({
      accessToken: 'token',
      user: {
        id: 'u2',
        firstName: 'Marta',
        lastName: 'Baker',
        email: 'marta@bakery.local',
        role: 'moderator'
      }
    });

    render(
      <MemoryRouter>
        <ShopPage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/butter croissant/i)).toBeInTheDocument();
    const button = screen.getAllByRole('button', { name: /unavailable/i })[0];
    expect(button).toBeDisabled();
    expect(mockedAddToCart).not.toHaveBeenCalled();
  });

  it('resets filters back to defaults', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ShopPage />
      </MemoryRouter>
    );

    await screen.findByText(/butter croissant/i);
    expect(screen.getByRole('button', { name: /reset filters/i })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Cakes' }));
    expect(screen.getByRole('button', { name: /reset filters/i })).toBeEnabled();
    await user.click(screen.getByRole('button', { name: /#party/i }));
    await user.click(screen.getByRole('checkbox', { name: /vegan only/i }));
    await user.click(screen.getByRole('button', { name: /reset filters/i }));

    expect(screen.getByRole('button', { name: /reset filters/i })).toBeDisabled();
    expect(screen.getByText(/butter croissant/i)).toBeInTheDocument();
    expect(screen.getByText(/chocolate celebration cake/i)).toBeInTheDocument();
  });

  it('keeps cart quantities at zero when cart fetch fails', async () => {
    mockedFetchCart.mockRejectedValue(new Error('network'));

    render(
      <MemoryRouter>
        <ShopPage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/butter croissant/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/in cart: 0/i).length).toBeGreaterThan(0);
  });
});
