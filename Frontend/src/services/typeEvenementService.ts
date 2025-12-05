import { api } from '../utils/api';
import { TypeEvenement } from '../types';

/**
 * ============================================================================
 * SERVICE DE GESTION DES TYPES D'ÉVÉNEMENTS (CATÉGORIES)
 * ============================================================================
 * Ce fichier sert à récupérer les catégories disponibles (Musique, Sport, Tech...).
 * Ces données sont essentielles pour remplir les menus déroulants (filtres)
 * et permettre aux utilisateurs de trier les événements.
 * ============================================================================
 */

export const typeEvenementService = {
  
  /**
   * Récupère la liste complète des types d'événements.
   * Utilisé notamment dans la page "EventsList" pour le filtre "Tous les types".
   * * @returns Une promesse contenant un tableau d'objets TypeEvenement.
   */
  async getAll(): Promise<TypeEvenement[]> {
    // Appel GET vers l'API Java : /api/type-evenement/all
    // Le serveur renvoie un tableau JSON : [{ id: 1, nom: "Musique" }, { id: 2, nom: "Sport" }...]
    const response = await api.get<TypeEvenement[]>('/api/type-evenement/all');
    
    // On retourne uniquement les données (le tableau), pas toute la réponse HTTP (headers, status...)
    return response.data;
  }
};