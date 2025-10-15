export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export const saveToken = (token: string, user: User) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    return token;
  }
  return null;
};

export const getUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user;
      } catch (error) {
        return null;
      }
    }
  }
  return null;
};

export const clearAuth = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  const authenticated = token !== null;
  return authenticated;
};

export const getAuthHeaders = () => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...(token && { 'token': token }),
  } as Record<string, string>;
  return headers;
};
