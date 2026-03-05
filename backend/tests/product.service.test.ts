import { parseProductListQuery, ProductError } from '../src/services/product.service.js';

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
