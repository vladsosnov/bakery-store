import { useEffect, useMemo, useState, type ChangeEvent, type FC, type MouseEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { addToCart, fetchCart } from '@src/services/cart-api';
import { getAuthSession } from '@src/services/auth-session';
import { listProducts } from '@src/services/product-api';
import { toErrorMessage } from '@src/utils/error';
import { ShopFilters } from '@src/components/pages/shop/ShopFilters';
import {
  CATEGORIES,
  filterProducts,
  getAddToCartLabel,
  getAvailableTags,
  isAddToCartDisabled,
  mapApiProduct
} from '@src/components/pages/shop/ShopPage.utils';
import { getDescriptionPreview } from '@src/utils/description-preview';
import {
  type Category,
  type Product,
  type ProductTag,
  type ShopFilterName
} from '@src/types/shop';
import * as S from './ShopPage.styles';

export const ShopPage: FC = () => {
  const session = useMemo(() => getAuthSession(), []);
  const isCustomer = session?.user.role === 'customer';
  const isBlockedCartRole = Boolean(session) && !isCustomer;
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
  const [imageLoadFailedByProduct, setImageLoadFailedByProduct] = useState<Record<string, boolean>>({});
  const availableTags = useMemo(() => getAvailableTags(products), [products]);
  const isResetDisabled =
    search.trim() === '' &&
    activeCategory === 'All' &&
    activeTag === 'All' &&
    !veganOnly &&
    !glutenFreeOnly &&
    !underTwenty;

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

  const handleCategorySelect = (category: Category) => {
    setActiveCategory(category);
    syncUrlFilters(category, activeTag);
  };

  const handleTagSelect = (tag: ProductTag) => {
    setActiveTag(tag);
    syncUrlFilters(activeCategory, tag);
  };

  const handleFilterToggle = (filterName: ShopFilterName, checked: boolean) => {
    if (filterName === 'veganOnly') {
      setVeganOnly(checked);
      return;
    }

    if (filterName === 'glutenFreeOnly') {
      setGlutenFreeOnly(checked);
      return;
    }

    setUnderTwenty(checked);
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

  const handleAddToCartClick = (event: MouseEvent<HTMLButtonElement>) => {
    const productId = event.currentTarget.dataset.productId;

    if (!productId) {
      return;
    }

    if (addingProductId === productId) {
      return;
    }

    if (!session) {
      toast.error('Sign in first to add products to your cart.');
      return;
    }

    if (!isCustomer) {
      toast.error('Moderators can not add products to cart.');
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
        toast.error(toErrorMessage(error, 'Failed to add product to cart.'));
      } finally {
        setAddingProductId(null);
      }
    };

    updateCart();
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
        setLoadError('Unable to load products list right now.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (!session || !isCustomer) {
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

    loadCart();
  }, [isCustomer, session]);

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
    return filterProducts(products, {
      activeCategory,
      activeTag,
      search,
      veganOnly,
      glutenFreeOnly,
      underTwenty
    });
  }, [activeCategory, activeTag, glutenFreeOnly, products, search, underTwenty, veganOnly]);

  const markProductImageAsFailed = (productId: string) => {
    setImageLoadFailedByProduct((previous) => {
      if (previous[productId]) {
        return previous;
      }

      return {
        ...previous,
        [productId]: true
      };
    });
  };

  return (
    <S.Main>
      <S.Header>
        <S.Title>Shop</S.Title>
        <S.Subtitle>
          Explore fresh bakery products with smart filters used in modern e-commerce apps.
        </S.Subtitle>
      </S.Header>

      <S.Layout>
        <ShopFilters
          search={search}
          activeCategory={activeCategory}
          activeTag={activeTag}
          availableTags={availableTags}
          veganOnly={veganOnly}
          glutenFreeOnly={glutenFreeOnly}
          underTwenty={underTwenty}
          filteredCount={filteredProducts.length}
          isResetDisabled={isResetDisabled}
          onSearchChange={handleSearchChange}
          onCategorySelect={handleCategorySelect}
          onTagSelect={handleTagSelect}
          onFilterToggle={handleFilterToggle}
          onReset={handleFiltersReset}
        >
          {isLoading ? (
            <S.EmptyState>Loading products...</S.EmptyState>
          ) : loadError ? (
            <S.EmptyState $error>{loadError}</S.EmptyState>
          ) : (
            <S.ResultTransition>
              {filteredProducts.length > 0 ? (
                <S.ProductsGrid>
                  {filteredProducts.map((product) => {
                    const quantityInCart = cartByProduct[product.id] ?? 0;
                    const hasImageSource = product.image.trim().length > 0;
                    const hasImageFailed = imageLoadFailedByProduct[product.id] ?? false;
                    const shouldShowImage = hasImageSource && !hasImageFailed;
                    const descriptionPreview = getDescriptionPreview(product.description);

                    return (
                      <S.ProductCard key={product.id}>
                        {shouldShowImage ? (
                          <S.ProductImage
                            src={product.image}
                            alt={product.name}
                            onError={() => markProductImageAsFailed(product.id)}
                          />
                        ) : (
                          <S.ProductImageFallback aria-label={`Image unavailable for ${product.name}`}>
                            No image available
                          </S.ProductImageFallback>
                        )}
                        <S.ProductBody>
                          <S.ProductTitle>{product.name}</S.ProductTitle>
                          <S.ProductMeta title={descriptionPreview.isTruncated ? product.description : undefined}>
                            {descriptionPreview.text}
                          </S.ProductMeta>
                          <S.ProductPrice>${product.price.toFixed(2)}</S.ProductPrice>
                          <S.ProductTags>
                            <S.ProductTag>{product.category}</S.ProductTag>
                            {product.tags.map((tag) => (
                              <S.ProductTag key={tag}>{tag}</S.ProductTag>
                            ))}
                          </S.ProductTags>
                          <S.ProductActions>
                            <S.ItemCount aria-label={`In cart: ${quantityInCart}`}>
                              In cart: {quantityInCart}
                            </S.ItemCount>
                            <S.AddToCartButton
                              type="button"
                              data-product-id={product.id}
                              disabled={
                                isAddToCartDisabled({
                                  isBlockedCartRole,
                                  addingProductId,
                                  productId: product.id,
                                  quantityInCart,
                                  stock: product.stock
                                })
                              }
                              onClick={handleAddToCartClick}
                            >
                              {getAddToCartLabel({
                                isBlockedCartRole,
                                addingProductId,
                                productId: product.id,
                                quantityInCart,
                                stock: product.stock
                              })}
                            </S.AddToCartButton>
                          </S.ProductActions>
                        </S.ProductBody>
                      </S.ProductCard>
                    );
                  })}
                </S.ProductsGrid>
              ) : (
                <S.EmptyState>
                  {products.length === 0
                    ? 'No products yet. A moderator will add items soon.'
                    : 'No results. Try changing filters or search query.'}
                </S.EmptyState>
              )}
            </S.ResultTransition>
          )}
        </ShopFilters>
      </S.Layout>
    </S.Main>
  );
};
