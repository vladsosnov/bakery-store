export const AUTH_STORAGE_KEY = 'bakery_auth';
export const AUTH_CHANGED_EVENT = 'bakery-auth-changed';

type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'customer' | 'moderator' | 'admin';
};

type AuthSession = {
  accessToken: string;
  user: AuthUser;
};

const dispatchAuthChanged = () => {
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
};

export const getAuthSession = (): AuthSession | null => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

export const setAuthSession = (session: AuthSession) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  dispatchAuthChanged();
};

export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  dispatchAuthChanged();
};

export const updateAuthSessionUser = (patch: Partial<AuthUser>) => {
  const session = getAuthSession();

  if (!session) {
    return;
  }

  const nextSession: AuthSession = {
    ...session,
    user: {
      ...session.user,
      ...patch
    }
  };

  setAuthSession(nextSession);
};
