import { render, screen } from '@testing-library/react';

import { AboutPage } from './AboutPage';

describe('AboutPage', () => {
  it('renders key about information', () => {
    render(<AboutPage />);

    expect(screen.getByRole('heading', { name: /about bakery store/i })).toBeInTheDocument();
    expect(screen.getByText(/vlad sosnov/i)).toBeInTheDocument();
    expect(screen.getByText(/our mission/i)).toBeInTheDocument();
  });
});
