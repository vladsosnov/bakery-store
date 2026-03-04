import { useMemo, useState } from 'react';

import * as S from './ShopPage.styles';

type Category = 'All' | 'Bread' | 'Cakes' | 'Pastries' | 'Cookies';

type Product = {
  id: number;
  name: string;
  category: Exclude<Category, 'All'>;
  price: number;
  image: string;
  description: string;
  tags: string[];
  dietary: {
    vegan: boolean;
    glutenFree: boolean;
  };
};

const CATEGORIES: Category[] = ['All', 'Bread', 'Cakes', 'Pastries', 'Cookies'];

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Butter croissant',
    category: 'Pastries',
    price: 4.5,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80',
    description: 'Flaky laminated pastry with cultured butter.',
    tags: ['Best seller'],
    dietary: { vegan: false, glutenFree: false }
  },
  {
    id: 2,
    name: 'Chocolate celebration cake',
    category: 'Cakes',
    price: 42,
    image: 'https://images.unsplash.com/photo-1602351447937-745cb720612f?auto=format&fit=crop&w=900&q=80',
    description: 'Rich cocoa sponge with silky ganache layers.',
    tags: ['Party'],
    dietary: { vegan: false, glutenFree: false }
  },
  {
    id: 3,
    name: 'Sourdough loaf',
    category: 'Bread',
    price: 8,
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=900&q=80',
    description: 'Naturally fermented bread with deep flavor.',
    tags: ['Artisan'],
    dietary: { vegan: true, glutenFree: false }
  },
  {
    id: 4,
    name: 'Strawberry shortcake',
    category: 'Cakes',
    price: 36,
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=80',
    description: 'Fresh cream cake layered with seasonal strawberries.',
    tags: ['Seasonal'],
    dietary: { vegan: false, glutenFree: false }
  },
  {
    id: 5,
    name: 'Almond flour cookie box',
    category: 'Cookies',
    price: 14,
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=80',
    description: 'Crunchy almond cookies with vanilla notes.',
    tags: ['Gift'],
    dietary: { vegan: false, glutenFree: true }
  },
  {
    id: 6,
    name: 'Vegan cinnamon roll',
    category: 'Pastries',
    price: 5.5,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
    description: 'Soft swirl pastry with cinnamon glaze.',
    tags: ['New'],
    dietary: { vegan: true, glutenFree: false }
  }
];

export function ShopPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [veganOnly, setVeganOnly] = useState(false);
  const [glutenFreeOnly, setGlutenFreeOnly] = useState(false);
  const [underTwenty, setUnderTwenty] = useState(false);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const byCategory = activeCategory === 'All' || product.category === activeCategory;
      const bySearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());
      const byVegan = !veganOnly || product.dietary.vegan;
      const byGlutenFree = !glutenFreeOnly || product.dietary.glutenFree;
      const byPrice = !underTwenty || product.price < 20;

      return byCategory && bySearch && byVegan && byGlutenFree && byPrice;
    });
  }, [activeCategory, search, veganOnly, glutenFreeOnly, underTwenty]);

  return (
    <S.Main>
      <S.Header>
        <S.Title>Shop</S.Title>
        <S.Subtitle>
          Explore fresh bakery products with smart filters used in modern e-commerce apps.
        </S.Subtitle>
      </S.Header>

      <S.Layout>
        <S.Sidebar>
          <S.SideTitle>Filters</S.SideTitle>

          <S.SideGroup>
            <S.GroupTitle>Dietary</S.GroupTitle>
            <S.CheckboxLabel>
              <input
                type="checkbox"
                checked={veganOnly}
                onChange={(event) => setVeganOnly(event.target.checked)}
              />
              Vegan only
            </S.CheckboxLabel>
            <S.CheckboxLabel>
              <input
                type="checkbox"
                checked={glutenFreeOnly}
                onChange={(event) => setGlutenFreeOnly(event.target.checked)}
              />
              Gluten-free only
            </S.CheckboxLabel>
          </S.SideGroup>

          <S.SideGroup>
            <S.GroupTitle>Price</S.GroupTitle>
            <S.CheckboxLabel>
              <input
                type="checkbox"
                checked={underTwenty}
                onChange={(event) => setUnderTwenty(event.target.checked)}
              />
              Under $20
            </S.CheckboxLabel>
          </S.SideGroup>

          <S.ResetButton
            type="button"
            onClick={() => {
              setSearch('');
              setActiveCategory('All');
              setVeganOnly(false);
              setGlutenFreeOnly(false);
              setUnderTwenty(false);
            }}
          >
            Reset filters
          </S.ResetButton>
        </S.Sidebar>

        <S.Content>
          <S.Toolbar>
            <S.SearchInput
              type="search"
              value={search}
              placeholder="Search cakes, bread, pastries..."
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search products"
            />

            <S.Categories>
              {CATEGORIES.map((category) => (
                <S.CategoryButton
                  key={category}
                  type="button"
                  $active={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </S.CategoryButton>
              ))}
            </S.Categories>

            <S.Summary>{filteredProducts.length} products found</S.Summary>
          </S.Toolbar>

          {filteredProducts.length > 0 ? (
            <S.ProductsGrid>
              {filteredProducts.map((product) => (
                <S.ProductCard key={product.id}>
                  <S.ProductImage src={product.image} alt={product.name} />
                  <S.ProductBody>
                    <S.ProductTitle>{product.name}</S.ProductTitle>
                    <S.ProductMeta>{product.description}</S.ProductMeta>
                    <S.ProductPrice>${product.price.toFixed(2)}</S.ProductPrice>
                    <S.ProductTags>
                      <S.ProductTag>{product.category}</S.ProductTag>
                      {product.tags.map((tag) => (
                        <S.ProductTag key={tag}>{tag}</S.ProductTag>
                      ))}
                    </S.ProductTags>
                  </S.ProductBody>
                </S.ProductCard>
              ))}
            </S.ProductsGrid>
          ) : (
            <S.EmptyState>No results. Try changing filters or search query.</S.EmptyState>
          )}
        </S.Content>
      </S.Layout>
    </S.Main>
  );
}
