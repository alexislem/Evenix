import { api } from '../utils/api';
import { 
  LoginRequest, 
  RegistrationRequest, 
  AuthResponse, 
  Utilisateur, 
  ApiResponse 
} from '../types';

export const authService = {
  
  // Login : Le backend renvoie ApiResponse<LoginData> (LoginData contient token + utilisateur)
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/login', credentials);
    // On retourne response.data.data car Axios met la réponse dans .data, 
    // et votre backend met le payload dans une propriété .data de l'objet JSON
    return response.data.data; 
  },

  // Register : Le backend renvoie ApiResponse<UtilisateurDTO> (pas de token)
  async register(data: RegistrationRequest): Promise<Utilisateur> {
    const response = await api.post<ApiResponse<Utilisateur>>('/api/auth/register', data);
    return response.data.data;
  },

  // Update Profile : Le backend renvoie directement le DTO (UtilisateurController)
  // Si vous avez modifié le controller pour renvoyer ApiResponse, ajoutez .data ici aussi
  async updateProfile(userId: number, data: Partial<Utilisateur>): Promise<Utilisateur> {
    const response = await api.put<Utilisateur>(`/api/utilisateur/${userId}`, data);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getStoredToken(): string | null {
    return localStorage.getItem('token');
  },

  getStoredUser(): Utilisateur | null {
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

  // On stocke les données après le login
  storeAuthData(token: string, utilisateur: Utilisateur) {
    localStorage.setItem('token', token);
    // On garde la clé 'user' pour la compatibilité avec le reste de l'app
    localStorage.setItem('user', JSON.stringify(utilisateur));
  },
};