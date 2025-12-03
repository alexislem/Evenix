export interface Role {
  id: number;
  nom: 'ADMIN' | 'PARTICIPANT' | 'ORGANISATEUR';
}

export interface TypeLieu {
  id: number;
  libelle: string;
}

export interface Lieu {
  id: number;
  nom: string;
  adresse: string;
  ville: string;
  nbPlaces: number;
  latitude?: number;
  longitude?: number;
  typeLieu: TypeLieu;
}

export interface TypeEvenement {
  id: number;
  nom: string;
}

export interface Entreprise {
  id: number;
  nom: string;
  adresse: string;
  email: string;
  telephone: string;
  secteurActivite?: string;
  statutJuridique?: string;
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
  payant: boolean;
  prix: number;
  image_url?: string;
  ville: string;
  lieu: Lieu;
  utilisateur: Utilisateur;
  types?: TypeEvenement[];
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
  code: string;
  date: string;
  montant: number;
  evenement: Evenement;
  utilisateur: Utilisateur;
}

export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface RegistrationRequest {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone?: string;
  dateDeNaissance?: string;
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
  payant: boolean;
  prix: number;
  lieuId: number;
  imageUrl?: string;
  typeEvenementIds?: number[];
}

export interface CreateLieuRequest {
  nom: string;
  adresse: string;
  ville: string;
  nbPlaces: number;
  latitude?: number;
  longitude?: number;
  typeLieuId: number;
}

export interface CreateEntrepriseRequest {
  nom: string;
  adresseSiege: string;
  email: string;
  telephone: string;
  secteurActivite?: string;
  statutJuridique?: string;
}
