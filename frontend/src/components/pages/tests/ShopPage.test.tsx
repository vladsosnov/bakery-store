import { render, screen } from '@testing-library/react';

import { ShopPage } from '../ShopPage';

describe('ShopPage', () => {
  it('renders shop placeholder content', () => {
    render(<ShopPage />);

    expect(screen.getByRole('heading', { name: /shop/i })).toBeInTheDocument();
    expect(screen.getByText(/product catalog will be implemented/i)).toBeInTheDocument();
  });
});
