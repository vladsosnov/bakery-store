import { parseCreateModeratorInput, parseUpdateModeratorInput } from '../src/services/admin.service.js';

describe('parseCreateModeratorInput', () => {
  it('accepts valid payload', () => {
    const parsed = parseCreateModeratorInput({
      firstName: 'Marta',
      lastName: 'Baker',
      email: 'marta@bakery.com',
      password: 'moderator123'
    });

    expect(parsed).toEqual({
      firstName: 'Marta',
      lastName: 'Baker',
      email: 'marta@bakery.com',
      password: 'moderator123'
    });
  });

  it('throws for invalid payload', () => {
    expect(() =>
      parseCreateModeratorInput({
        firstName: '',
        lastName: 'Baker',
        email: 'wrong-email',
        password: '123'
      })
    ).toThrow();
  });
});

describe('parseUpdateModeratorInput', () => {
  it('accepts partial payload', () => {
    const parsed = parseUpdateModeratorInput({
      firstName: 'Updated',
      isActive: false
    });

    expect(parsed).toEqual({
      firstName: 'Updated',
      isActive: false
    });
  });

  it('throws for empty payload', () => {
    expect(() => parseUpdateModeratorInput({})).toThrow();
  });
});
