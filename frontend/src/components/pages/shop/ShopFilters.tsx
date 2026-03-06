import type { ChangeEventHandler, FC, ReactNode } from 'react';

import * as S from '@src/components/pages/shop/ShopPage.styles';
import {
  CATEGORIES,
  type Category,
  type ProductTag,
  type ShopFilterName
} from './ShopPage.utils';

type ShopFiltersProps = {
  search: string;
  activeCategory: Category;
  activeTag: ProductTag;
  availableTags: ProductTag[];
  veganOnly: boolean;
  glutenFreeOnly: boolean;
  underTwenty: boolean;
  filteredCount: number;
  isResetDisabled: boolean;
  onSearchChange: ChangeEventHandler<HTMLInputElement>;
  onCategorySelect: (category: Category) => void;
  onTagSelect: (tag: ProductTag) => void;
  onFilterToggle: (filterName: ShopFilterName, checked: boolean) => void;
  onReset: () => void;
  children: ReactNode;
};

export const ShopFilters: FC<ShopFiltersProps> = ({
  search,
  activeCategory,
  activeTag,
  availableTags,
  veganOnly,
  glutenFreeOnly,
  underTwenty,
  filteredCount,
  isResetDisabled,
  onSearchChange,
  onCategorySelect,
  onTagSelect,
  onFilterToggle,
  onReset,
  children
}) => {
  return (
    <>
      <S.Sidebar>
        <S.SideTitle>Filters</S.SideTitle>

        <S.SideGroup>
          <S.GroupTitle>Dietary</S.GroupTitle>
          <S.CheckboxLabel>
            <input
              type="checkbox"
              name="veganOnly"
              checked={veganOnly}
              onChange={(event) => onFilterToggle('veganOnly', event.target.checked)}
            />
            Vegan only
          </S.CheckboxLabel>
          <S.CheckboxLabel>
            <input
              type="checkbox"
              name="glutenFreeOnly"
              checked={glutenFreeOnly}
              onChange={(event) => onFilterToggle('glutenFreeOnly', event.target.checked)}
            />
            Gluten-free only
          </S.CheckboxLabel>
        </S.SideGroup>

        <S.SideGroup>
          <S.GroupTitle>Price</S.GroupTitle>
          <S.CheckboxLabel>
            <input
              type="checkbox"
              name="underTwenty"
              checked={underTwenty}
              onChange={(event) => onFilterToggle('underTwenty', event.target.checked)}
            />
            Under $20
          </S.CheckboxLabel>
        </S.SideGroup>

        <S.ResetButton type="button" onClick={onReset} disabled={isResetDisabled}>
          Reset filters
        </S.ResetButton>
      </S.Sidebar>

      <S.Content>
        <S.Toolbar>
          <S.SearchInput
            type="search"
            value={search}
            placeholder="Search cakes, bread, pastries..."
            onChange={onSearchChange}
            aria-label="Search products"
          />

          <S.Categories>
            {CATEGORIES.map((category) => (
              <S.CategoryButton
                key={category}
                type="button"
                $active={activeCategory === category}
                onClick={() => onCategorySelect(category)}
              >
                {category}
              </S.CategoryButton>
            ))}
          </S.Categories>

          <S.Categories aria-label="Tag filters">
            {availableTags.map((tag) => (
              <S.CategoryButton
                key={tag}
                type="button"
                $active={activeTag === tag}
                onClick={() => onTagSelect(tag)}
              >
                #{tag}
              </S.CategoryButton>
            ))}
          </S.Categories>

          <S.Summary>{filteredCount} products found</S.Summary>
        </S.Toolbar>
        {children}
      </S.Content>
    </>
  );
};
