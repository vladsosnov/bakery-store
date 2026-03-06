import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { shopRoutes } from '@src/app/routes';
import { HomePage } from './HomePage';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('HomePage', () => {
  afterEach(() => {
    jest.useRealTimers();
    mockNavigate.mockReset();
  });

  it('renders home hero content', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /new: raspberry croissant cream/i })).toBeInTheDocument();
    expect(screen.getByText(/why everyone loves our bakery/i)).toBeInTheDocument();
  });

  it('navigates to slide route on CTA click', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /shop new collection/i }));

    expect(mockNavigate).toHaveBeenCalledWith(shopRoutes.withTag('New'));
  });

  it('changes slide on dot click and ignores invalid dot index', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /go to slide 3/i }));
    expect(screen.getByRole('heading', { name: /sourdough of the month/i })).toBeInTheDocument();

    const firstDot = screen.getByRole('button', { name: /go to slide 1/i });
    firstDot.removeAttribute('data-index');
    await user.click(firstDot);

    expect(screen.getByRole('heading', { name: /sourdough of the month/i })).toBeInTheDocument();
  });

  it('auto-rotates slides and clears timeout on unmount', () => {
    jest.useFakeTimers();
    const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');

    const { unmount } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    act(() => {
      jest.advanceTimersByTime(4500);
    });

    expect(screen.getByRole('heading', { name: /weekend cake specials/i })).toBeInTheDocument();

    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
