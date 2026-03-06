import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ShopFilters } from '../ShopFilters';

describe('ShopFilters', () => {
  const baseProps = {
    search: '',
    activeCategory: 'All' as const,
    activeTag: 'All' as const,
    availableTags: ['All', 'New', 'Bread'],
    veganOnly: false,
    glutenFreeOnly: false,
    underTwenty: false,
    filteredCount: 12,
    isResetDisabled: false,
    onSearchChange: jest.fn(),
    onCategorySelect: jest.fn(),
    onTagSelect: jest.fn(),
    onFilterToggle: jest.fn(),
    onReset: jest.fn()
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders filters, summary, and children', () => {
    render(
      <ShopFilters {...baseProps}>
        <div>Products content</div>
      </ShopFilters>
    );

    expect(screen.getByRole('heading', { name: /filters/i })).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: /search products/i })).toBeInTheDocument();
    expect(screen.getByText(/12 products found/i)).toBeInTheDocument();
    expect(screen.getByText(/products content/i)).toBeInTheDocument();
  });

  it('calls search/category/tag handlers', async () => {
    const user = userEvent.setup();

    render(
      <ShopFilters {...baseProps}>
        <div />
      </ShopFilters>
    );

    await user.type(screen.getByRole('searchbox', { name: /search products/i }), 'cake');
    await user.click(screen.getByRole('button', { name: 'Cakes' }));
    await user.click(screen.getByRole('button', { name: '#New' }));

    expect(baseProps.onSearchChange).toHaveBeenCalled();
    expect(baseProps.onCategorySelect).toHaveBeenCalledWith('Cakes');
    expect(baseProps.onTagSelect).toHaveBeenCalledWith('New');
  });

  it('calls filter toggle and reset handlers', async () => {
    const user = userEvent.setup();

    render(
      <ShopFilters {...baseProps}>
        <div />
      </ShopFilters>
    );

    await user.click(screen.getByRole('checkbox', { name: /vegan only/i }));
    await user.click(screen.getByRole('checkbox', { name: /gluten-free only/i }));
    await user.click(screen.getByRole('checkbox', { name: /under \$20/i }));
    await user.click(screen.getByRole('button', { name: /reset filters/i }));

    expect(baseProps.onFilterToggle).toHaveBeenNthCalledWith(1, 'veganOnly', true);
    expect(baseProps.onFilterToggle).toHaveBeenNthCalledWith(2, 'glutenFreeOnly', true);
    expect(baseProps.onFilterToggle).toHaveBeenNthCalledWith(3, 'underTwenty', true);
    expect(baseProps.onReset).toHaveBeenCalledTimes(1);
  });

  it('disables reset button when no filters are active', () => {
    render(
      <ShopFilters {...baseProps} isResetDisabled>
        <div />
      </ShopFilters>
    );

    expect(screen.getByRole('button', { name: /reset filters/i })).toBeDisabled();
  });
});
