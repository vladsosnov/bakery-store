import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { SiteLayout } from '../SiteLayout';

describe('SiteLayout chat', () => {
  it('opens and closes chat widget from floating button', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<SiteLayout />}>
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
});
