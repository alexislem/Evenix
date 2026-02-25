import axios from 'axios';

// ============================================================================
// CONFIGURATION DU CLIENT HTTP (AXIOS)
// ============================================================================
// Ce fichier sert à configurer "l'outil" qui va discuter avec le Backend (Java).
// Au lieu de réécrire l'URL "http://localhost:8080" et d'ajouter le token
// à la main dans chaque fichier, on le fait une seule fois ici.
// ============================================================================

// L'adresse de votre serveur Backend Spring Boot
const API_BASE_URL = 'http://localhost:8080';

/**
 * Création d'une instance personnalisée d'Axios.
 * C'est comme créer un navigateur pré-configuré pour notre application.
 */
export const api = axios.create({
  baseURL: API_BASE_URL, // Toutes les requêtes partiront de cette adresse
  headers: {
    'Content-Type': 'application/json', // On dit au serveur qu'on lui parle en JSON
  },
});

/**
 * ============================================================================
 * INTERCEPTEUR DE REQUÊTE (REQUEST INTERCEPTOR)
 * ============================================================================
 * C'est comme un douanier à la sortie : avant que la requête ne quitte
 * votre navigateur pour aller vers le serveur, ce code s'exécute.
 */
api.interceptors.request.use(
  (config) => {
    // 1. On cherche le "passeport" (le token) dans la poche (LocalStorage)
    const token = localStorage.getItem('token');
    
    // 2. Si on a un token, on l'agrafe à la requête
    if (token) {
      // Le header "Authorization" est standard. "Bearer" signifie "Porteur du token".
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 3. On laisse passer la requête vers le serveur
    return config;
  },
  (error) => {
    // Si la requête est mal formée avant même de partir, on signale l'erreur
    return Promise.reject(error);
  }
);

/**
 * ============================================================================
 * INTERCEPTEUR DE RÉPONSE (RESPONSE INTERCEPTOR)
 * ============================================================================
 * C'est le douanier à l'entrée : quand le serveur répond, on intercepte
 * la réponse avant qu'elle n'arrive à votre composant React.
 */
api.interceptors.response.use(
  // Cas 1 : Tout va bien (Succès 200, 201...)
  (response) => response, // On laisse passer la réponse telle quelle

  // Cas 2 : Le serveur renvoie une erreur (4xx, 5xx)
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';

    // ERREUR 401 : "Non autorisé" (Token invalide ou expiré)
    // On ajoute une exception : si l'erreur vient de la page de login elle-même,
    // on ne redirige pas (sinon ça ferait une boucle infinie).
    if (status === 401 && !url.includes('/api/auth/login')) {
      console.warn("Session expirée, déconnexion automatique.");
      
      // 1. On nettoie les données périmées
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // 2. On force le rechargement de la page vers le login
      // (C'est une méthode brutale mais efficace pour être sûr de tout nettoyer)
      window.location.href = '/login';
    }

    // On renvoie l'erreur pour que le composant puisse afficher un message rouge (ex: "Erreur serveur")
    return Promise.reject(error);
  }
);

// On exporte cet outil configuré pour l'utiliser partout ailleurs (api.get, api.post...)
export default api;