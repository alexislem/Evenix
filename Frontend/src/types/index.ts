// ============================================================================
// FICHIER DE DÉFINITION DES TYPES (INTERFACES)
// ============================================================================
// Ce fichier sert de "dictionnaire" pour notre application React.
// Il définit la forme exacte que doivent avoir nos données.
// Cela permet à TypeScript de nous prévenir si on oublie un champ ou si on se trompe de type.
// ============================================================================

// --- ENTITÉS DE BASE (Miroir de la Base de Données) ---

/**
 * Représente un Rôle utilisateur (ADMIN, ORGANISATEUR, PARTICIPANT).
 * C'est ce qui définit les permissions dans l'application.
 */
export interface Role {
  id: number;
  nom: string; // Ex: 'ADMIN', 'PARTICIPANT'
}

/**
 * Catégorie d'un événement (ex: Musique, Sport, Tech...).
 * Sert pour les filtres de recherche.
 */
export interface TypeEvenement {
  id: number;
  nom: string;
}

/**
 * Représente un lieu physique où se déroule un événement.
 * Cette interface est conçue pour être compatible avec Google Maps.
 */
export interface Lieu {
  id: number;
  nom: string;        // Nom du lieu (ex: "Le Grand Rex")
  adresse: string;    // Adresse complète formatée
  ville: string;      // Ville extraite pour la recherche
  
  // Les champs optionnels (?) peuvent être indéfinis si Google Maps ne les donne pas
  codePostal?: string;
  latitude?: number;  // Coordonnée GPS pour la carte
  longitude?: number; // Coordonnée GPS pour la carte
  
  typeLieu?: string;      // Ex: "stadium", "museum" (info Google)
  googlePlaceId?: string; // L'ID unique de Google pour éviter les doublons
  
  capaciteMax: number;    // Nombre de places maximum (info manuelle, pas Google)
}

/**
 * Représente une entreprise (pour les Organisateurs professionnels).
 */
export interface Entreprise {
  id: number;
  nom: string;
  adresse: string;
  email: string;
}

/**
 * L'utilisateur connecté ou un profil public.
 * C'est l'objet central de l'authentification.
 */
export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  
  // "?" signifie que le champ n'est pas obligatoire (ex: on peut s'inscrire sans téléphone)
  telephone?: string;
  dateDeNaissance?: string; // Format "YYYY-MM-DD" (Texte car React gère mal les objets Date directement)
  
  role: Role; // Relation : Un utilisateur A un rôle obligatoirement
  entreprise?: Entreprise; // Relation : Un utilisateur PEUT avoir une entreprise
}

/**
 * L'objet principal de l'application : L'Événement.
 * Contient toutes les infos affichées sur la carte et la liste.
 */
export interface Evenement {
  id: number;
  nom: string;
  description: string;
  dateDebut: string; // Format ISO (ex: "2025-12-25T20:00:00")
  dateFin: string;
  
  ville: string;     // Ville affichée sur la carte (souvent copiée du Lieu)
  prix: number;      // 0 = Gratuit
  
  imageUrl?: string; // Lien vers l'image de couverture (optionnel)
  
  // Relations (Objets imbriqués)
  lieu: Lieu;               // Où ça se passe ?
  utilisateur: Utilisateur; // Qui l'organise ?
  types: TypeEvenement[];   // Tableau de catégories (Musique, Art...)
}

/**
 * Lien entre un Utilisateur et un Événement.
 * C'est le "billet" électronique.
 */
export interface Inscription {
  id: number;
  dateInscription: string;
  
  // Si cette date est remplie, l'inscription est considérée comme annulée
  dateAnnulation?: string;
  
  evenement: Evenement;     // Pour quel événement ?
  utilisateur: Utilisateur; // Qui est inscrit ?
}

/**
 * Trace d'une transaction financière si l'événement est payant.
 */
export interface Paiement {
  id: number;
  montant: number;
  datePaiement: string;
  moyenPaiement: string; // Ex: 'CARTE', 'PAYPAL'
  statut: string;        // Ex: 'SUCCES', 'ECHEC'
  inscriptionId: number; // On stocke juste l'ID pour éviter les boucles infinies (Paiement -> Inscription -> Paiement...)
}

// --- DTO (Data Transfer Objects) POUR LES REQUÊTES ---
// Ces interfaces définissent ce qu'on ENVOIE au serveur (contrairement aux entités qu'on REÇOIT).

/**
 * Ce qu'on envoie quand on se connecte.
 */
export interface LoginRequest {
  email: string;
  motDePasse: string;
}

/**
 * Ce qu'on envoie quand on crée un compte.
 * Inclut maintenant les questions de sécurité pour la récupération de mot de passe.
 */
export interface RegistrationRequest {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone?: string;
  dateDeNaissance?: string;
  
  // Nouveaux champs de sécurité (Optionnels car on peut les ajouter plus tard)
  questionSecurite?: string; 
  reponseSecurite?: string;
}

/**
 * La réponse du serveur après un login réussi.
 * Contient le sésame (Token) et les infos de l'utilisateur.
 */
export interface AuthResponse {
  token: string;           // Le JWT (JSON Web Token)
  utilisateur: Utilisateur; // Les infos pour l'affichage (Nom, Rôle...)
}

/**
 * Formulaire de création d'un événement.
 * Notez que 'lieu' est 'Partial' car on envoie parfois un nouveau lieu pas encore créé en base.
 */
export interface CreateEventRequest {
  nom: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  prix: number;
  ville: string;
  imageUrl?: string;
  
  // On envoie l'objet lieu (nom, adresse, id google...) pour que le backend gère la création/récupération
  lieu: Partial<Lieu>; 
  
  types: { id: number }[]; // On envoie juste les IDs des catégories
}

/**
 * Formulaire de création d'une entreprise (Admin).
 */
export interface CreateEntrepriseRequest {
  nom: string;
  adresse: string;
  email: string;
}

// --- RÉPONSE GÉNÉRIQUE API ---

/**
 * Enveloppe standard renvoyée par notre Backend Java (ApiResponse.java).
 * T est un "Générique" : cela veut dire que "data" peut être n'importe quel type (User, Event, etc.)
 * selon le contexte.
 */
export interface ApiResponse<T> {
  success: boolean; // Est-ce que l'opération a marché ?
  message: string;  // Message d'info ou d'erreur
  data: T;          // La vraie donnée transportée
}