import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Utilisateur, LoginRequest, RegistrationRequest, AuthResponse } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: Utilisateur | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isOrganisateur: boolean;
  isParticipant: boolean;
  
  // Modifié : retourne une Promise<any> pour permettre la redirection dans Login.tsx
  login: (credentials: LoginRequest) => Promise<any>; 
  
  register: (data: RegistrationRequest) => Promise<void>;
  logout: () => void;
  
  // Ajouté : Nécessaire pour Profile.tsx
  updateUser: (data: Utilisateur) => void; 
  
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
    // authService.login renvoie { token, utilisateur }
    const response = await authService.login(credentials);
    
    // On stocke
    authService.storeAuthData(response.token, response.utilisateur);
    setToken(response.token);
    setUser(response.utilisateur);
    
    // IMPORTANT : On retourne la réponse pour que le composant Login puisse lire le rôle
    return response; 
  };

  const register = async (data: RegistrationRequest) => {
    // authService.register renvoie l'utilisateur créé, mais PAS de token
    // On ne connecte donc PAS l'utilisateur automatiquement ici.
    await authService.register(data);
    
    // Optionnel : Vous pourriez déclencher un login automatique ici si vous modifiez le backend
    // pour renvoyer un token lors de l'inscription, mais pour l'instant on ne fait rien.
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  // --- NOUVELLE FONCTION ---
  const updateUser = (updatedUser: Utilisateur) => {
    setUser(updatedUser);
    // On met à jour le localStorage pour ne pas perdre les infos au refresh
    // On réutilise le token actuel s'il existe
    if (token) {
        authService.storeAuthData(token, updatedUser);
    }
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
    updateUser, // Ne pas oublier de l'exposer
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