import { api } from '../utils/api';
import { LoginRequest, RegistrationRequest, AuthResponse } from '../types';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/login', credentials);
    return response.data;
  },

  async register(data: RegistrationRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getStoredToken(): string | null {
    return localStorage.getItem('token');
  },

  getStoredUser(): any | null {
  const userStr = localStorage.getItem('user');
  if (!userStr || userStr === 'undefined' || userStr === 'null') {
    return null;
  }

  try {
    return JSON.parse(userStr);
  } catch (e) {
    console.error('Erreur JSON.parse(user):', e, 'value=', userStr);
    localStorage.removeItem('user');
    return null;
  }
},

  storeAuthData(token: string, user: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
};
