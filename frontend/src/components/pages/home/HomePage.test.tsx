import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { HomePage } from './HomePage';

describe('HomePage', () => {
  it('renders home hero content', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /new: raspberry croissant cream/i })).toBeInTheDocument();
    expect(screen.getByText(/why everyone loves our bakery/i)).toBeInTheDocument();
  });
});
