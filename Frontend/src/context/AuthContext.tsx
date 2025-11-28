import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Utilisateur, LoginRequest, RegistrationRequest } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: Utilisateur | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isOrganisateur: boolean;
  isParticipant: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegistrationRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Utilisateur | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = authService.getStoredToken();
    const storedUser = authService.getStoredUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    const response = await authService.login(credentials);
    authService.storeAuthData(response.token, response.utilisateur);
    setToken(response.token);
    setUser(response.utilisateur);
  };

  const register = async (data: RegistrationRequest) => {
    const response = await authService.register(data);
    authService.storeAuthData(response.token, response.utilisateur);
    setToken(response.token);
    setUser(response.utilisateur);
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  const hasRole = (roleName: string): boolean => {
    return user?.role?.nom === roleName || false;
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isAdmin: hasRole('ADMIN'),
    isOrganisateur: hasRole('ORGANISATEUR'),
    isParticipant: hasRole('PARTICIPANT'),
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
