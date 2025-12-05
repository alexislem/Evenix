import { api } from '../utils/api';
import { Paiement } from '../types';

/**
 * ============================================================================
 * SERVICE DE GESTION DES PAIEMENTS
 * ============================================================================
 * Ce fichier gère la communication avec le serveur pour tout ce qui touche
 * aux transactions financières.
 * C'est l'équivalent du "terminal de paiement" de notre application.
 * ============================================================================
 */

/**
 * DTO (Data Transfer Object) pour la CRÉATION d'un paiement.
 * C'est un "moule" qui définit strictement ce qu'on doit envoyer au serveur pour payer.
 * * Pourquoi une interface spéciale ici ? 
 * Parce que l'objet "Paiement" complet (défini dans types.ts) contient des choses 
 * qu'on ne décide pas nous-mêmes côté client (comme l'ID unique du paiement, 
 * ou la date exacte à la seconde près qui est fixée par le serveur).
 */
export interface CreatePaiementRequest {
  montant: number;       // Combien l'utilisateur doit payer (ex: 45.50)
  moyenPaiement: string; // Comment il paie (ex: 'CARTE', 'PAYPAL')
  
  // C'est le lien le plus important : on paie pour QUOI ?
  // On paie pour valider une "Inscription" précise.
  inscriptionId: number; 
}

export const paiementService = {
  
  /**
   * Envoie une demande de paiement au serveur.
   * Cette fonction est appelée dans la page "InscriptionPage" lorsque l'utilisateur
   * clique sur "Payer et s'inscrire" pour un événement payant.
   * * @param data - Les détails du paiement (montant, méthode, ID inscription).
   * @returns Une promesse contenant le paiement validé (avec son statut 'SUCCES').
   */
  async create(data: CreatePaiementRequest): Promise<Paiement> {
    // Appel POST vers l'URL du backend qui traite les paiements
    // Route : /api/paiement/traiter
    const response = await api.post<Paiement>('/api/paiement/traiter', data);
    
    // Le serveur renvoie l'objet paiement créé (avec la date confirmée et l'ID)
    return response.data;
  },

  /**
   * Récupère les détails d'un paiement spécifique grâce à son ID.
   * Cette fonction pourrait servir plus tard si on veut afficher une page "Reçu" 
   * ou "Facture" pour l'utilisateur.
   * * @param id - L'identifiant unique du paiement.
   */
  async getById(id: number): Promise<Paiement> {
    // Appel GET vers /api/paiement/{id}
    const response = await api.get<Paiement>(`/api/paiement/${id}`);
    return response.data;
  }
};