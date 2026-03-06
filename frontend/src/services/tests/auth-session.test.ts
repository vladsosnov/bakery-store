import {
  AUTH_CHANGED_EVENT,
  AUTH_STORAGE_KEY,
  clearAuthSession,
  getAuthSession,
  setAuthSession,
  updateAuthSessionUser
} from '../auth-session';

describe('auth-session service', () => {
  const session = {
    accessToken: 'token',
    user: {
      id: 'u1',
      firstName: 'Vlad',
      lastName: 'Sosnov',
      email: 'vlad@bakery.local',
      role: 'customer' as const
    }
  };

  afterEach(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  });

  it('stores and reads auth session', () => {
    setAuthSession(session);

    expect(getAuthSession()).toEqual(session);
  });

  it('returns null and clears invalid json payload', () => {
    localStorage.setItem(AUTH_STORAGE_KEY, '{invalid-json');

    expect(getAuthSession()).toBeNull();
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
  });

  it('updates user fields in existing session', () => {
    setAuthSession(session);

    updateAuthSessionUser({ firstName: 'Volodymyr' });

    expect(getAuthSession()?.user.firstName).toBe('Volodymyr');
    expect(getAuthSession()?.user.lastName).toBe('Sosnov');
  });

  it('does nothing on update when session is missing', () => {
    updateAuthSessionUser({ firstName: 'Volodymyr' });

    expect(getAuthSession()).toBeNull();
  });

  it('clears session', () => {
    setAuthSession(session);
    clearAuthSession();

    expect(getAuthSession()).toBeNull();
  });

  it('dispatches auth changed event on set and clear', () => {
    const handler = jest.fn();
    window.addEventListener(AUTH_CHANGED_EVENT, handler);

    setAuthSession(session);
    clearAuthSession();

    expect(handler).toHaveBeenCalledTimes(2);
    window.removeEventListener(AUTH_CHANGED_EVENT, handler);
  });
});
