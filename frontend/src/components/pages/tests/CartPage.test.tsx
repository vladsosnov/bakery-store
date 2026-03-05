import { render, screen } from '@testing-library/react';

import { AUTH_STORAGE_KEY } from '@src/services/auth-session';
import { CartPage } from '../CartPage';

describe('CartPage', () => {
  afterEach(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  });

  it('asks guest to sign in', () => {
    render(<CartPage />);

    expect(screen.getByRole('heading', { name: /cart/i })).toBeInTheDocument();
    expect(screen.getByText(/please sign in to access your cart/i)).toBeInTheDocument();
  });

  it('shows cart content for authenticated user', () => {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        accessToken: 'token',
        user: {
          id: 'u1',
          firstName: 'Vlad',
          lastName: 'Sosnov',
          email: 'vlad@bakery.local',
          role: 'customer'
        }
      })
    );

    render(<CartPage />);

    expect(screen.getByText(/hi vlad, your cart is empty for now/i)).toBeInTheDocument();
  });
});
