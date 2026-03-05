import {
  parseChangePasswordInput,
  parseLoginInput,
  parseRegisterInput
} from '../src/services/auth.service.js';

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

describe('parseLoginInput', () => {
  it('accepts valid login payload', () => {
    const parsed = parseLoginInput({
      email: 'vlad@bakery.com',
      password: 'password123'
    });

    expect(parsed).toEqual({
      email: 'vlad@bakery.com',
      password: 'password123'
    });
  });

  it('throws for invalid payload', () => {
    expect(() =>
      parseLoginInput({
        email: 'bad-email',
        password: ''
      })
    ).toThrow();
  });
});

describe('parseChangePasswordInput', () => {
  it('accepts valid email payload', () => {
    const parsed = parseChangePasswordInput({
      email: 'vlad@bakery.com'
    });

    expect(parsed).toEqual({
      email: 'vlad@bakery.com'
    });
  });

  it('throws for invalid payload', () => {
    expect(() =>
      parseChangePasswordInput({
        email: 'wrong-email'
      })
    ).toThrow();
  });
});
