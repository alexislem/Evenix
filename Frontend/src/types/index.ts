export interface Role {
  id: number;
  nom: string;
}

export interface TypeEvenement {
  id: number;
  nom: string;
}

export interface Lieu {
  id: number;
  nom: string;
  adresse: string;
  ville: string;
  codePostal?: string;
  latitude?: number;
  longitude?: number;
  typeLieu?: string;
  googlePlaceId?: string;
  capaciteMax: number;
}

export interface Entreprise {
  id: number;
  nom: string;
  adresse: string;
  email: string;
}

export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  dateDeNaissance?: string;
  role: Role;
  entreprise?: Entreprise;
}

export interface Evenement {
  id: number;
  nom: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  ville: string;
  prix: number;
  imageUrl?: string; 
  lieu: Lieu;
  utilisateur: Utilisateur;
  types: TypeEvenement[];
}

export interface Inscription {
  id: number;
  dateInscription: string;
  dateAnnulation?: string;
  evenement: Evenement;
  utilisateur: Utilisateur;
}

export interface Paiement {
  id: number;
  montant: number;
  datePaiement: string;
  moyenPaiement: string;
  statut: string;
  inscriptionId: number;
}

export interface LoginRequest {
  email: string;
  motDePasse: string;
}

// Mise à jour pour inclure les champs de sécurité
export interface RegistrationRequest {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone?: string;
  dateDeNaissance?: string;
  questionSecurite?: string; // Nouveau
  reponseSecurite?: string;  // Nouveau
}

export interface AuthResponse {
  token: string;
  utilisateur: Utilisateur;
}

export interface CreateEventRequest {
  nom: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  prix: number;
  ville: string;
  imageUrl?: string;
  lieu: Partial<Lieu>; 
  types: { id: number }[];
}

export interface CreateEntrepriseRequest {
  nom: string;
  adresse: string;
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}