import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { ROUTES } from '@src/app/routes';
import { AUTH_STORAGE_KEY } from '@src/services/auth-session';
import { SiteLayout } from '../SiteLayout';

describe('SiteLayout chat', () => {
  afterEach(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  });

  it('opens and closes chat widget from floating button', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={[ROUTES.home]}>
        <Routes>
          <Route path={ROUTES.home} element={<SiteLayout />}>
            <Route index element={<div>Home content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /open chat/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /open chat/i }));
    const panel = screen.getByRole('region', { name: /support chat panel/i });
    expect(panel).toBeInTheDocument();

    await user.click(within(panel).getByRole('button', { name: /close chat/i }));
    expect(screen.queryByRole('region', { name: /support chat panel/i })).not.toBeInTheDocument();
  });

  it('opens cart panel with authorize-first message', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={[ROUTES.home]}>
        <Routes>
          <Route path={ROUTES.home} element={<SiteLayout />}>
            <Route index element={<div>Home content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /open cart/i }));
    expect(screen.getByRole('region', { name: /cart panel/i })).toBeInTheDocument();
    expect(screen.getByText(/authorize first/i)).toBeInTheDocument();
  });

  it('shows profile and hides sign in/sign up for authenticated users', () => {
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

    render(
      <MemoryRouter initialEntries={[ROUTES.home]}>
        <Routes>
          <Route path={ROUTES.home} element={<SiteLayout />}>
            <Route index element={<div>Home content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByRole('link', { name: /sign in/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /sign up/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /my orders/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /profile/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('shows regular cart content for authenticated users', async () => {
    const user = userEvent.setup();

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

    render(
      <MemoryRouter initialEntries={[ROUTES.home]}>
        <Routes>
          <Route path={ROUTES.home} element={<SiteLayout />}>
            <Route index element={<div>Home content</div>} />
            <Route path="cart" element={<div>Cart content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /go to cart page/i }));
    expect(screen.getByText(/cart content/i)).toBeInTheDocument();
    expect(screen.queryByText(/authorize first/i)).not.toBeInTheDocument();
  });

  it('shows admin dashboard link for moderator users', () => {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        accessToken: 'token',
        user: {
          id: 'u2',
          firstName: 'Marta',
          lastName: 'Baker',
          email: 'marta@bakery.local',
          role: 'moderator'
        }
      })
    );

    render(
      <MemoryRouter initialEntries={[ROUTES.home]}>
        <Routes>
          <Route path={ROUTES.home} element={<SiteLayout />}>
            <Route index element={<div>Home content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /admin dashboard/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /open chat/i })).not.toBeInTheDocument();
  });
});
