import {
  CartError,
  parseAddCartItemInput,
  parseUpdateCartItemQuantityInput
} from '../src/services/cart.service.js';

describe('parseAddCartItemInput', () => {
  it('accepts payload with productId and quantity', () => {
    const parsed = parseAddCartItemInput({
      productId: '67cc3987ec8b91b8ef6fc9ea',
      quantity: 2
    });

    expect(parsed).toEqual({
      productId: '67cc3987ec8b91b8ef6fc9ea',
      quantity: 2
    });
  });

  it('defaults quantity to 1', () => {
    const parsed = parseAddCartItemInput({
      productId: '67cc3987ec8b91b8ef6fc9ea'
    });

    expect(parsed).toEqual({
      productId: '67cc3987ec8b91b8ef6fc9ea',
      quantity: 1
    });
  });

  it('throws CartError for invalid payload', () => {
    expect(() =>
      parseAddCartItemInput({
        productId: '',
        quantity: 0
      })
    ).toThrow(CartError);
  });
});

describe('parseUpdateCartItemQuantityInput', () => {
  it('accepts payload with quantity', () => {
    const parsed = parseUpdateCartItemQuantityInput({
      quantity: 3
    });

    expect(parsed).toEqual({
      quantity: 3
    });
  });

  it('throws CartError for invalid payload', () => {
    expect(() =>
      parseUpdateCartItemQuantityInput({
        quantity: 0
      })
    ).toThrow(CartError);
  });
});
