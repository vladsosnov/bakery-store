import {
  filterProducts,
  getAddToCartLabel,
  getAvailableTags,
  isAddToCartDisabled,
  mapApiProduct,
  type Product
} from '../ShopPage.utils';

describe('ShopPage.utils', () => {
  it('maps API product and keeps provided dietary data', () => {
    const mapped = mapApiProduct({
      _id: 'p1',
      name: 'Butter croissant',
      slug: 'butter-croissant',
      description: 'Classic pastry',
      category: 'Pastries',
      price: 4.5,
      imageUrl: 'https://example.com/p1.jpg',
      tags: ['Best seller'],
      isAvailable: true,
      stock: 10,
      dietary: {
        vegan: false,
        glutenFree: false
      }
    });

    expect(mapped).toEqual({
      id: 'p1',
      name: 'Butter croissant',
      category: 'Pastries',
      price: 4.5,
      stock: 10,
      image: 'https://example.com/p1.jpg',
      description: 'Classic pastry',
      tags: ['Best seller'],
      dietary: {
        vegan: false,
        glutenFree: false
      }
    });
  });

  it('maps unknown category to Pastries and infers dietary from text', () => {
    const mapped = mapApiProduct({
      _id: 'p2',
      name: 'Vegan almond flour cookies',
      slug: 'vegan-cookies',
      description: 'Soft cookies',
      category: 'Unknown',
      price: 6,
      imageUrl: 'https://example.com/p2.jpg',
      tags: ['New'],
      isAvailable: true,
      stock: 7
    });

    expect(mapped.category).toBe('Pastries');
    expect(mapped.dietary.vegan).toBe(true);
    expect(mapped.dietary.glutenFree).toBe(true);
  });

  it('returns unique tags and respects limit', () => {
    const products: Product[] = [
      {
        id: '1',
        name: 'A',
        category: 'Bread',
        price: 1,
        stock: 1,
        image: '',
        description: '',
        tags: ['New', 'Bread'],
        dietary: { vegan: false, glutenFree: false }
      },
      {
        id: '2',
        name: 'B',
        category: 'Cakes',
        price: 2,
        stock: 1,
        image: '',
        description: '',
        tags: ['Party', 'Bread'],
        dietary: { vegan: false, glutenFree: false }
      },
      {
        id: '3',
        name: 'C',
        category: 'Pastries',
        price: 3,
        stock: 1,
        image: '',
        description: '',
        tags: ['Seasonal'],
        dietary: { vegan: false, glutenFree: false }
      }
    ];

    expect(getAvailableTags(products, 2)).toEqual(['All', 'New', 'Bread']);
    expect(getAvailableTags(products)).toEqual(['All', 'New', 'Bread', 'Party', 'Seasonal']);
  });

  it('filters products by category, tag, search, dietary and price', () => {
    const products: Product[] = [
      {
        id: '1',
        name: 'Vegan cinnamon roll',
        category: 'Pastries',
        price: 5.5,
        stock: 10,
        image: '',
        description: 'Soft swirl pastry',
        tags: ['New'],
        dietary: { vegan: true, glutenFree: false }
      },
      {
        id: '2',
        name: 'Sourdough loaf',
        category: 'Bread',
        price: 8,
        stock: 10,
        image: '',
        description: 'Naturally fermented bread',
        tags: ['Bread'],
        dietary: { vegan: true, glutenFree: false }
      },
      {
        id: '3',
        name: 'Chocolate celebration cake',
        category: 'Cakes',
        price: 42,
        stock: 10,
        image: '',
        description: 'Rich cocoa sponge',
        tags: ['Party'],
        dietary: { vegan: false, glutenFree: false }
      }
    ];

    const result = filterProducts(products, {
      activeCategory: 'Pastries',
      activeTag: 'New',
      search: 'cinnamon',
      veganOnly: true,
      glutenFreeOnly: false,
      underTwenty: true
    });

    expect(result.map((product) => product.id)).toEqual(['1']);
  });

  it('returns correct add-to-cart labels by priority', () => {
    expect(
      getAddToCartLabel({
        isBlockedCartRole: true,
        addingProductId: 'p1',
        productId: 'p1',
        quantityInCart: 10,
        stock: 10
      })
    ).toBe('Unavailable');

    expect(
      getAddToCartLabel({
        isBlockedCartRole: false,
        addingProductId: 'p1',
        productId: 'p1',
        quantityInCart: 1,
        stock: 10
      })
    ).toBe('Adding...');

    expect(
      getAddToCartLabel({
        isBlockedCartRole: false,
        addingProductId: null,
        productId: 'p1',
        quantityInCart: 10,
        stock: 10
      })
    ).toBe('Max in cart');

    expect(
      getAddToCartLabel({
        isBlockedCartRole: false,
        addingProductId: null,
        productId: 'p1',
        quantityInCart: 2,
        stock: 10
      })
    ).toBe('Add to cart');
  });

  it('disables add-to-cart correctly', () => {
    expect(
      isAddToCartDisabled({
        isBlockedCartRole: true,
        addingProductId: null,
        productId: 'p1',
        quantityInCart: 0,
        stock: 10
      })
    ).toBe(true);

    expect(
      isAddToCartDisabled({
        isBlockedCartRole: false,
        addingProductId: 'p1',
        productId: 'p1',
        quantityInCart: 0,
        stock: 10
      })
    ).toBe(true);

    expect(
      isAddToCartDisabled({
        isBlockedCartRole: false,
        addingProductId: null,
        productId: 'p1',
        quantityInCart: 10,
        stock: 10
      })
    ).toBe(true);

    expect(
      isAddToCartDisabled({
        isBlockedCartRole: false,
        addingProductId: null,
        productId: 'p1',
        quantityInCart: 2,
        stock: 10
      })
    ).toBe(false);
  });
});
