import {
  parseCreateProductInput,
  parseProductListQuery,
  parseUpdateProductInput,
  ProductError
} from '../src/services/product.service.js';

describe('parseProductListQuery', () => {
  it('accepts empty query object', () => {
    expect(parseProductListQuery({})).toEqual({});
  });

  it('accepts valid category/tag/search query', () => {
    expect(
      parseProductListQuery({
        category: 'Bread',
        tag: 'New',
        search: 'sourdough'
      })
    ).toEqual({
      category: 'Bread',
      tag: 'New',
      search: 'sourdough'
    });
  });

  it('throws ProductError for invalid query values', () => {
    expect(() => parseProductListQuery({ category: '' })).toThrow(ProductError);
  });
});

describe('parseCreateProductInput', () => {
  it('accepts valid payload', () => {
    expect(
      parseCreateProductInput({
        name: 'Sourdough loaf',
        description: 'Fresh loaf',
        category: 'Bread',
        price: 8,
        imageUrl: 'https://example.com/image.jpg',
        tags: ['Bread', 'Artisan'],
        stock: 10,
        isAvailable: true
      })
    ).toEqual({
      name: 'Sourdough loaf',
      description: 'Fresh loaf',
      category: 'Bread',
      price: 8,
      imageUrl: 'https://example.com/image.jpg',
      tags: ['Bread', 'Artisan'],
      stock: 10,
      isAvailable: true
    });
  });

  it('throws ProductError for invalid payload', () => {
    expect(() =>
      parseCreateProductInput({
        name: '',
        description: 'Fresh loaf',
        category: 'Bread',
        price: -1,
        imageUrl: 'wrong',
        tags: ['Bread'],
        stock: -5
      })
    ).toThrow(ProductError);
  });

  it('throws ProductError when description is longer than 200 characters', () => {
    expect(() =>
      parseCreateProductInput({
        name: 'Sourdough loaf',
        description: 'x'.repeat(201),
        category: 'Bread',
        price: 8,
        imageUrl: 'https://example.com/image.jpg',
        tags: ['Bread'],
        stock: 5,
        isAvailable: true
      })
    ).toThrow(ProductError);
  });
});

describe('parseUpdateProductInput', () => {
  it('accepts partial payload', () => {
    expect(
      parseUpdateProductInput({
        isAvailable: false,
        stock: 0
      })
    ).toEqual({
      isAvailable: false,
      stock: 0
    });
  });

  it('throws ProductError for empty payload', () => {
    expect(() => parseUpdateProductInput({})).toThrow(ProductError);
  });

  it('throws ProductError when description is longer than 200 characters', () => {
    expect(() =>
      parseUpdateProductInput({
        description: 'x'.repeat(201)
      })
    ).toThrow(ProductError);
  });
});
