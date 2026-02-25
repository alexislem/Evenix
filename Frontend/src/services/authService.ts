import { api } from '../utils/api';
import { 
  LoginRequest, 
  RegistrationRequest, 
  AuthResponse, 
  Utilisateur, 
  ApiResponse 
} from '../types';

/**
 * ============================================================================
 * SERVICE D'AUTHENTIFICATION
 * ============================================================================
 * Ce fichier contient toutes les fonctions qui permettent de discuter avec
 * le serveur (Backend) pour tout ce qui concerne les utilisateurs.
 * * Il fait le lien entre :
 * 1. L'interface React (qui demande "Connecte-moi")
 * 2. Le serveur Java (qui vérifie le mot de passe et renvoie le token)
 * ============================================================================
 */
export const authService = {
  
  /**
   * Envoie l'email et le mot de passe au serveur pour se connecter.
   * @param credentials - L'objet contenant { email, motDePasse }
   * @returns Une promesse contenant le Token et les infos de l'utilisateur.
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // 1. On fait l'appel API (POST /api/auth/login)
    // On précise <ApiResponse<AuthResponse>> pour dire à TypeScript à quoi ressemble la réponse du serveur.
    const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/login', credentials);
    
    // 2. On retourne les données utiles.
    // - response.data : C'est le corps de la réponse HTTP (géré par Axios).
    // - response.data.data : C'est notre champ "data" spécifique défini dans le Backend Java (ApiResponse.java).
    return response.data.data; 
  },

  /**
   * Envoie les données d'inscription pour créer un nouveau compte.
   */
  async register(data: RegistrationRequest): Promise<Utilisateur> {
    const response = await api.post<ApiResponse<Utilisateur>>('/api/auth/register', data);
    // Ici, le backend renvoie l'utilisateur créé, mais généralement pas le token tout de suite.
    return response.data.data;
  },

  /**
   * Met à jour les informations du profil (Nom, Prénom, etc.).
   * Utilisé dans la page "Mon Profil".
   */
  async updateProfile(userId: number, data: Partial<Utilisateur>): Promise<Utilisateur> {
    // Note : On utilise PUT car on met à jour une ressource existante.
    const response = await api.put<Utilisateur>(`/api/utilisateur/${userId}`, data);
    // Ici, le contrôleur Java renvoie directement l'objet Utilisateur sans le wrapper ApiResponse,
    // donc on accède directement à response.data.
    return response.data;
  },

  /**
   * Déconnecte l'utilisateur.
   * En architecture "Token" (Stateless), se déconnecter signifie simplement
   * "oublier" le token. Le serveur n'a pas besoin d'être prévenu.
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Récupère le token stocké dans le navigateur.
   * Utile pour savoir si on est déjà connecté quand on rafraîchit la page.
   */
  getStoredToken(): string | null {
    return localStorage.getItem('token');
  },

  /**
   * Récupère les infos de l'utilisateur (Nom, Email...) stockées dans le navigateur.
   * On doit utiliser JSON.parse car le LocalStorage ne stocke que du texte.
   */
  getStoredUser(): Utilisateur | null {
    const userStr = localStorage.getItem('user');
    
    // Si rien n'est trouvé ou si c'est corrompu ('undefined'), on renvoie null
    if (!userStr || userStr === 'undefined' || userStr === 'null') {
      return null;
    }

    try {
      // On transforme le texte "{ 'nom': '...' }" en véritable objet JavaScript
      return JSON.parse(userStr);
    } catch (e) {
      // Si le JSON est cassé, on nettoie tout par sécurité
      console.error('Erreur JSON.parse(user):', e, 'value=', userStr);
      localStorage.removeItem('user');
      return null;
    }
  },

  /**
   * Sauvegarde les infos de connexion dans le navigateur (LocalStorage).
   * Cela permet à l'utilisateur de rester connecté même s'il ferme l'onglet.
   */
  storeAuthData(token: string, utilisateur: Utilisateur) {
    localStorage.setItem('token', token);
    // On transforme l'objet utilisateur en texte pour le stocker
    localStorage.setItem('user', JSON.stringify(utilisateur));
  },
};