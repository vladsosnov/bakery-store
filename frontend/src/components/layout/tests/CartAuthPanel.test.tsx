import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { ROUTES } from '@src/app/routes';
import { CartAuthPanel } from '../CartAuthPanel';

describe('CartAuthPanel', () => {
  it('renders authorize content for guest users', () => {
    const onClose = jest.fn();

    render(
      <MemoryRouter>
        <CartAuthPanel onClose={onClose} isAuthenticated={false} />
      </MemoryRouter>
    );

    expect(screen.getByRole('region', { name: /cart panel/i })).toBeInTheDocument();
    expect(screen.getByText(/authorize first to access your cart and checkout/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', ROUTES.signIn);
    expect(screen.getByRole('link', { name: /sign up/i })).toHaveAttribute('href', ROUTES.signUp);
  });

  it('calls onClose for close button and auth links', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(
      <MemoryRouter>
        <CartAuthPanel onClose={onClose} isAuthenticated={false} />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /close cart panel/i }));
    await user.click(screen.getByRole('link', { name: /sign in/i }));
    await user.click(screen.getByRole('link', { name: /sign up/i }));

    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it('renders empty-cart message for authenticated users', () => {
    const onClose = jest.fn();

    render(
      <MemoryRouter>
        <CartAuthPanel onClose={onClose} isAuthenticated firstName="Vlad" />
      </MemoryRouter>
    );

    expect(screen.getByText(/vlad, your cart is empty right now/i)).toBeInTheDocument();
    expect(screen.getByText(/add products from shop to start checkout/i)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /sign in/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /sign up/i })).not.toBeInTheDocument();
  });
});
