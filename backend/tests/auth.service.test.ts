import {
  parseChangePasswordInput,
  parseLoginInput,
  parseRegisterInput,
  parseSetPasswordInput,
  parseUpdateProfileInput
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

describe('parseSetPasswordInput', () => {
  it('accepts valid set-password payload', () => {
    const parsed = parseSetPasswordInput({
      email: 'vlad@bakery.com',
      currentPassword: 'oldPassword123',
      newPassword: 'newPassword123'
    });

    expect(parsed).toEqual({
      email: 'vlad@bakery.com',
      currentPassword: 'oldPassword123',
      newPassword: 'newPassword123'
    });
  });

  it('throws for invalid payload', () => {
    expect(() =>
      parseSetPasswordInput({
        email: 'wrong-email',
        currentPassword: '',
        newPassword: '123'
      })
    ).toThrow();
  });
});

describe('parseUpdateProfileInput', () => {
  it('accepts valid profile payload', () => {
    const parsed = parseUpdateProfileInput({
      firstName: 'Vlad',
      lastName: 'Sosnov',
      phoneNumber: '+15550001122',
      address: {
        zip: '10001',
        street: '5th Avenue 10',
        city: 'New York'
      }
    });

    expect(parsed).toEqual({
      firstName: 'Vlad',
      lastName: 'Sosnov',
      phoneNumber: '+15550001122',
      address: {
        zip: '10001',
        street: '5th Avenue 10',
        city: 'New York'
      }
    });
  });

  it('throws for invalid payload', () => {
    expect(() =>
      parseUpdateProfileInput({
        firstName: '',
        lastName: 'Sosnov',
        phoneNumber: '',
        address: {
          zip: '',
          street: '',
          city: ''
        }
      })
    ).toThrow();
  });
});
