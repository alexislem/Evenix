import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Utilisateur, LoginRequest, RegistrationRequest } from '../types';
import { authService } from '../services/authService';

/**
 * ==============================================================================
 * DÉFINITION DU "CONTRAT" (INTERFACE)
 * ==============================================================================
 * Ici, on définit la forme que prendront nos données d'authentification.
 * C'est comme un menu : cela liste tout ce qui sera disponible pour
 * les autres composants de l'application (les pages, les boutons, etc.).
 */
interface AuthContextType {
  // L'utilisateur connecté (ou null si personne n'est connecté)
  user: Utilisateur | null;
  
  // Le jeton de sécurité (JWT) qui prouve qu'on est connecté
  token: string | null;
  
  // Un booléen (vrai/faux) pratique pour savoir vite fait si on est connecté
  isAuthenticated: boolean;
  
  // Des booléens pour vérifier facilement le rôle de l'utilisateur
  isAdmin: boolean;
  isOrganisateur: boolean;
  isParticipant: boolean;
  
  // Les fonctions pour agir sur l'authentification
  // Elles renvoient des "Promesses" car ce sont des actions qui prennent du temps (appel serveur)
  login: (credentials: LoginRequest) => Promise<any>; 
  register: (data: RegistrationRequest) => Promise<void>;
  logout: () => void;
  
  // Fonction pour mettre à jour les infos locales sans recharger la page
  updateUser: (data: Utilisateur) => void; 
  
  // Indique si l'application est encore en train de vérifier si on est connecté (au chargement)
  loading: boolean;
}

/**
 * ==============================================================================
 * CRÉATION DU CONTEXTE
 * ==============================================================================
 * On crée une "boîte globale" qui va contenir nos données.
 * Au départ, elle est indéfinie (undefined) car elle n'a pas encore été remplie.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * ==============================================================================
 * LE FOURNISSEUR (PROVIDER)
 * ==============================================================================
 * C'est le composant principal. Il va "envelopper" toute notre application.
 * Son rôle est de gérer la logique (state) et de distribuer les données aux enfants.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  
  // --- ÉTATS (STATES) ---
  // Ce sont les mémoires de notre application. Quand ils changent, l'affichage se met à jour.
  const [user, setUser] = useState<Utilisateur | null>(null);
  const [token, setToken] = useState<string | null>(null);
  
  // "loading" est vrai au début, car on ne sait pas encore si l'utilisateur est connecté ou pas
  const [loading, setLoading] = useState(true);

  /**
   * --- EFFET DE DÉMARRAGE (useEffect) ---
   * Ce code ne s'exécute qu'une seule fois, au moment où l'application se lance.
   * Son but : Vérifier si l'utilisateur était déjà connecté avant (ex: il a rafraîchi la page).
   */
  useEffect(() => {
    // 1. On regarde dans le stockage du navigateur (LocalStorage)
    const storedToken = authService.getStoredToken();
    const storedUser = authService.getStoredUser();

    // 2. Si on trouve des traces d'une connexion précédente
    if (storedToken && storedUser) {
      setToken(storedToken); // On restaure le token
      setUser(storedUser);   // On restaure les infos utilisateur
    }
    
    // 3. On a fini de charger, on peut afficher l'application
    setLoading(false);
  }, []);

  /**
   * --- FONCTION DE CONNEXION (LOGIN) ---
   * Appelée quand l'utilisateur clique sur "Se connecter"
   */
  const login = async (credentials: LoginRequest) => {
    // 1. On appelle le service qui contacte le serveur (Backend Spring Boot)
    // La réponse contient le token et les infos de l'utilisateur
    const response = await authService.login(credentials);
    
    // 2. On sauvegarde ces infos dans le navigateur (pour rester connecté si on ferme l'onglet)
    authService.storeAuthData(response.token, response.utilisateur);
    
    // 3. On met à jour l'état de l'application (pour que l'interface change immédiatement)
    setToken(response.token);
    setUser(response.utilisateur);
    
    // 4. On renvoie la réponse (utile pour savoir quel rôle a l'utilisateur et le rediriger)
    return response; 
  };

  /**
   * --- FONCTION D'INSCRIPTION (REGISTER) ---
   */
  const register = async (data: RegistrationRequest) => {
    // On envoie les données au serveur pour créer le compte.
    // Note : Le serveur ne renvoie pas de token ici, donc on ne connecte pas l'utilisateur automatiquement.
    // Il devra se connecter manuellement juste après.
    await authService.register(data);
  };

  /**
   * --- FONCTION DE DÉCONNEXION (LOGOUT) ---
   */
  const logout = () => {
    // 1. On nettoie le stockage du navigateur
    authService.logout();
    // 2. On remet les états à null (l'interface redeviendra celle d'un visiteur anonyme)
    setToken(null);
    setUser(null);
  };

  /**
   * --- MISE À JOUR DU PROFIL ---
   * Utile quand l'utilisateur change son nom ou téléphone dans la page "Mon Profil".
   * Cela évite d'avoir à se déconnecter/reconnecter pour voir les changements.
   */
  const updateUser = (updatedUser: Utilisateur) => {
    setUser(updatedUser); // Met à jour l'affichage
    
    // Si on a un token, on met aussi à jour le stockage navigateur
    if (token) {
        authService.storeAuthData(token, updatedUser);
    }
  };

  /**
   * --- UTILITAIRE DE VÉRIFICATION DE RÔLE ---
   * Permet de savoir simplement si l'utilisateur a un rôle spécifique (ADMIN, etc.)
   */
  const hasRole = (roleName: string): boolean => {
    // Le "?" (optional chaining) évite que ça plante si "user" est null
    return user?.role?.nom === roleName || false;
  };

  /**
   * --- L'OBJET À PARTAGER ---
   * On regroupe toutes nos variables et fonctions dans un seul objet "value".
   * C'est cet objet que tous les composants de l'application pourront utiliser.
   */
  const value: AuthContextType = {
    user,
    token,
    // isAuthenticated est vrai seulement si on a un token ET un utilisateur
    isAuthenticated: !!token && !!user, 
    isAdmin: hasRole('ADMIN'),
    isOrganisateur: hasRole('ORGANISATEUR'),
    isParticipant: hasRole('PARTICIPANT'),
    login,
    register,
    logout,
    updateUser, 
    loading,
  };

  // On retourne le "Provider" qui rend disponible "value" pour tous les "children" (les composants fils)
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * ==============================================================================
 * LE HOOK PERSONNALISÉ (CUSTOM HOOK)
 * ==============================================================================
 * C'est une petite fonction utilitaire pour faciliter l'utilisation du contexte.
 * Au lieu d'écrire `useContext(AuthContext)` partout, on écrira juste `useAuth()`.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  // Sécurité : on vérifie qu'on utilise bien le hook à l'intérieur du <AuthProvider>
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};