import { parseRegisterInput } from '../src/services/auth.service.js';

describe('parseRegisterInput', () => {
  it('accepts valid registration payload', () => {
    const parsed = parseRegisterInput({
      firstName: 'Vlad',
      lastName: 'Sosnov',
      email: 'vlad@bakery.com',
      password: 'password123'
    });

    expect(parsed).toEqual({
      firstName: 'Vlad',
      lastName: 'Sosnov',
      email: 'vlad@bakery.com',
      password: 'password123'
    });
  });

  it('throws for invalid payload', () => {
    expect(() =>
      parseRegisterInput({
        firstName: '',
        lastName: 'Sosnov',
        email: 'bad-email',
        password: '123'
      })
    ).toThrow();
  });
});
