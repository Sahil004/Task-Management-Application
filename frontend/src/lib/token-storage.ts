const TOKEN_KEY = 'taskflow-token';
const USER_KEY = 'taskflow-user';

export const tokenStorage = {
  getToken: () => (typeof window === 'undefined' ? null : window.localStorage.getItem(TOKEN_KEY)),
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(TOKEN_KEY, token);
    }
  },
  clearToken: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(TOKEN_KEY);
    }
  },
  getUser: () => {
    if (typeof window === 'undefined') {
      return null;
    }

    const value = window.localStorage.getItem(USER_KEY);
    return value ? JSON.parse(value) : null;
  },
  setUser: (user: unknown) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },
  clearUser: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(USER_KEY);
    }
  },
};
