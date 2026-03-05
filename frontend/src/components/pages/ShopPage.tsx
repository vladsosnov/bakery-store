import axios from 'axios';
import { useEffect, useMemo, useState, type ChangeEvent, type FC, type MouseEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { addToCart, fetchCart } from '@src/services/cart-api';
import { getAuthSession } from '@src/services/auth-session';
import { listProducts, type ApiProduct } from '@src/services/product-api';
import * as S from './ShopPage.styles';

type Category = 'All' | 'Bread' | 'Cakes' | 'Pastries' | 'Cookies';
type ProductTag = 'All' | string;

type Product = {
  id: string;
  name: string;
  category: Exclude<Category, 'All'>;
  price: number;
  stock: number;
  image: string;
  description: string;
  tags: string[];
  dietary: {
    vegan: boolean;
    glutenFree: boolean;
  };
};

const CATEGORIES: Category[] = ['All', 'Bread', 'Cakes', 'Pastries', 'Cookies'];

const inferDietary = (product: ApiProduct) => {
  if (product.dietary) {
    return product.dietary;
  }

  const combinedText = `${product.name} ${product.tags.join(' ')}`.toLowerCase();

  return {
    vegan: combinedText.includes('vegan'),
    glutenFree: combinedText.includes('gluten') || combinedText.includes('almond flour')
  };
};

const toCategory = (category: string): Exclude<Category, 'All'> => {
  const isKnownCategory = CATEGORIES.includes(category as Category) && category !== 'All';

  return isKnownCategory ? (category as Exclude<Category, 'All'>) : 'Pastries';
};

const mapApiProduct = (product: ApiProduct): Product => {
  return {
    id: product._id,
    name: product.name,
    category: toCategory(product.category),
    price: product.price,
    stock: product.stock,
    image: product.imageUrl,
    description: product.description,
    tags: product.tags,
    dietary: inferDietary(product)
  };
};

export const ShopPage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [activeTag, setActiveTag] = useState<ProductTag>('All');
  const [veganOnly, setVeganOnly] = useState(false);
  const [glutenFreeOnly, setGlutenFreeOnly] = useState(false);
  const [underTwenty, setUnderTwenty] = useState(false);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const [cartByProduct, setCartByProduct] = useState<Record<string, number>>({});
  const availableTags = useMemo<ProductTag[]>(() => {
    const uniqueTags = new Set<string>();

    products.forEach((product) => {
      product.tags.forEach((tag) => uniqueTags.add(tag));
    });

    return ['All', ...Array.from(uniqueTags).slice(0, 10)];
  }, [products]);

  const syncUrlFilters = (category: Category, tag: ProductTag) => {
    const params = new URLSearchParams(searchParams);

    if (category === 'All') {
      params.delete('category');
    } else {
      params.set('category', category);
    }

    if (tag === 'All') {
      params.delete('tag');
    } else {
      params.set('tag', tag);
    }

    setSearchParams(params);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleFiltersReset = () => {
    setSearch('');
    setActiveCategory('All');
    setActiveTag('All');
    setVeganOnly(false);
    setGlutenFreeOnly(false);
    setUnderTwenty(false);
    setSearchParams(new URLSearchParams());
  };

  const handleFilterToggle = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;

    if (name === 'veganOnly') {
      setVeganOnly(checked);
      return;
    }

    if (name === 'glutenFreeOnly') {
      setGlutenFreeOnly(checked);
      return;
    }

    if (name === 'underTwenty') {
      setUnderTwenty(checked);
    }
  };

  const handleCategoryClick = (event: MouseEvent<HTMLButtonElement>) => {
    const category = event.currentTarget.dataset.category;

    if (category && CATEGORIES.includes(category as Category)) {
      const nextCategory = category as Category;
      setActiveCategory(nextCategory);
      syncUrlFilters(nextCategory, activeTag);
    }
  };

  const handleTagClick = (event: MouseEvent<HTMLButtonElement>) => {
    const tag = event.currentTarget.dataset.tag;

    if (tag && availableTags.includes(tag)) {
      setActiveTag(tag);
      syncUrlFilters(activeCategory, tag);
    }
  };

  const handleAddToCartClick = (event: MouseEvent<HTMLButtonElement>) => {
    const productId = event.currentTarget.dataset.productId;

    if (!productId) {
      return;
    }

    if (addingProductId === productId) {
      return;
    }
    const session = getAuthSession();

    if (!session) {
      toast.error('Sign in first to add products to your cart.');
      return;
    }

    const updateCart = async () => {
      try {
        setAddingProductId(productId);

        const response = await addToCart({ productId, quantity: 1 });
        const nextCartByProduct = response.data.items.reduce<Record<string, number>>((acc, item) => {
          acc[item.productId] = item.quantity;
          return acc;
        }, {});

        setCartByProduct(nextCartByProduct);
      } catch (error) {
        const errorMessage = axios.isAxiosError<{ error?: string }>(error)
          ? error.response?.data?.error ?? 'Failed to add product to cart.'
          : 'Failed to add product to cart.';
        toast.error(errorMessage);
      } finally {
        setAddingProductId(null);
      }
    };

    void updateCart();
  };

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        const response = await listProducts();
        setProducts(response.map(mapApiProduct));
      } catch {
        toast.error('Failed to load products. Please try again.');
        setLoadError('Failed to load products. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadProducts();
  }, []);

  useEffect(() => {
    const session = getAuthSession();
    if (!session) {
      setCartByProduct({});
      return;
    }

    const loadCart = async () => {
      try {
        const response = await fetchCart();
        const nextCartByProduct = response.data.items.reduce<Record<string, number>>((acc, item) => {
          acc[item.productId] = item.quantity;
          return acc;
        }, {});

        setCartByProduct(nextCartByProduct);
      } catch {
        setCartByProduct({});
      }
    };

    void loadCart();
  }, []);

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    const tagFromUrl = searchParams.get('tag');

    if (categoryFromUrl && CATEGORIES.includes(categoryFromUrl as Category)) {
      setActiveCategory(categoryFromUrl as Category);
    } else {
      setActiveCategory('All');
    }

    if (tagFromUrl && availableTags.includes(tagFromUrl)) {
      setActiveTag(tagFromUrl);
    } else {
      setActiveTag('All');
    }
  }, [availableTags, searchParams]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const byCategory = activeCategory === 'All' || product.category === activeCategory;
      const bySearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());
      const byVegan = !veganOnly || product.dietary.vegan;
      const byGlutenFree = !glutenFreeOnly || product.dietary.glutenFree;
      const byPrice = !underTwenty || product.price < 20;
      const byTag = activeTag === 'All' || product.tags.includes(activeTag);

      return byCategory && bySearch && byVegan && byGlutenFree && byPrice && byTag;
    });
  }, [activeCategory, activeTag, products, search, veganOnly, glutenFreeOnly, underTwenty]);

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
                name="veganOnly"
                checked={veganOnly}
                onChange={handleFilterToggle}
              />
              Vegan only
            </S.CheckboxLabel>
            <S.CheckboxLabel>
              <input
                type="checkbox"
                name="glutenFreeOnly"
                checked={glutenFreeOnly}
                onChange={handleFilterToggle}
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
                onChange={handleFilterToggle}
              />
              Under $20
            </S.CheckboxLabel>
          </S.SideGroup>

          <S.ResetButton type="button" onClick={handleFiltersReset}>
            Reset filters
          </S.ResetButton>
        </S.Sidebar>

        <S.Content>
          <S.Toolbar>
            <S.SearchInput
              type="search"
              value={search}
              placeholder="Search cakes, bread, pastries..."
              onChange={handleSearchChange}
              aria-label="Search products"
            />

            <S.Categories>
              {CATEGORIES.map((category) => (
                <S.CategoryButton
                  key={category}
                  type="button"
                  data-category={category}
                  $active={activeCategory === category}
                  onClick={handleCategoryClick}
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
                  data-tag={tag}
                  $active={activeTag === tag}
                  onClick={handleTagClick}
                >
                  #{tag}
                </S.CategoryButton>
              ))}
            </S.Categories>

            <S.Summary>{filteredProducts.length} products found</S.Summary>
          </S.Toolbar>

          {isLoading ? (
            <S.EmptyState>Loading products...</S.EmptyState>
          ) : loadError ? (
            <S.EmptyState $error>{loadError}</S.EmptyState>
          ) : (
            <S.ResultTransition>
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
                        <S.ProductActions>
                          <S.ItemCount aria-label={`In cart: ${cartByProduct[product.id] ?? 0}`}>
                            In cart: {cartByProduct[product.id] ?? 0}
                          </S.ItemCount>
                          <S.AddToCartButton
                            type="button"
                            data-product-id={product.id}
                            disabled={
                              addingProductId === product.id ||
                              (cartByProduct[product.id] ?? 0) >= product.stock
                            }
                            onClick={handleAddToCartClick}
                          >
                            {addingProductId === product.id
                              ? 'Adding...'
                              : (cartByProduct[product.id] ?? 0) >= product.stock
                                ? 'Max in cart'
                                : 'Add to cart'}
                          </S.AddToCartButton>
                        </S.ProductActions>
                      </S.ProductBody>
                    </S.ProductCard>
                  ))}
                </S.ProductsGrid>
              ) : (
                <S.EmptyState>No results. Try changing filters or search query.</S.EmptyState>
              )}
            </S.ResultTransition>
          )}
        </S.Content>
      </S.Layout>
    </S.Main>
  );
};
