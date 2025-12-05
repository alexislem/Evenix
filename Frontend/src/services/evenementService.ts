import { api } from '../utils/api';
import { Evenement, CreateEventRequest } from '../types';

/**
 * ============================================================================
 * SERVICE DE GESTION DES ÉVÉNEMENTS
 * ============================================================================
 * Ce fichier est le "chef d'orchestre" pour tout ce qui concerne les événements.
 * Il permet de :
 * - Récupérer la liste des événements (pour l'accueil)
 * - Voir les détails d'un événement spécifique
 * - Créer, Modifier ou Supprimer un événement (pour les organisateurs)
 * ============================================================================
 */

export const evenementService = {
  
  /**
   * Récupère TOUS les événements disponibles sur la plateforme.
   * C'est la fonction utilisée par la page "EventsList" (Catalogue).
   * @returns Une promesse contenant la liste complète des événements.
   */
  async getAll(): Promise<Evenement[]> {
    // Appel GET vers /api/evenement/all
    const response = await api.get<Evenement[]>('/api/evenement/all');
    return response.data;
  },

  /**
   * Récupère les détails d'un SEUL événement grâce à son ID.
   * Utilisé par la page "EventDetail" quand on clique sur une carte.
   * @param id - L'identifiant unique de l'événement.
   */
  async getById(id: number): Promise<Evenement> {
    // Appel GET vers /api/evenement/{id}
    const response = await api.get<Evenement>(`/api/evenement/${id}`);
    return response.data;
  },

  /**
   * Crée un nouvel événement.
   * * ⚠️ PARTICULARITÉ : 
   * Le backend a besoin de savoir QUI crée l'événement (l'organisateur).
   * Au lieu de mettre l'ID dans le corps (data), l'API Java attend un paramètre d'URL ("Query Param").
   * C'est pour ça qu'on écrit : `?organisateurId=${organisateurId}`.
   * * @param data - Les infos de l'événement (titre, date, lieu...)
   * @param organisateurId - L'ID de l'utilisateur connecté qui crée l'événement.
   */
  async create(data: CreateEventRequest, organisateurId: number): Promise<Evenement> {
    const response = await api.post<Evenement>(`/api/evenement?organisateurId=${organisateurId}`, data);
    return response.data;
  },

  /**
   * Met à jour un événement existant.
   * @param id - L'ID de l'événement à modifier.
   * @param data - Les nouvelles informations (on utilise Partial<> car on peut ne changer qu'un seul champ).
   */
  async update(id: number, data: Partial<CreateEventRequest>): Promise<Evenement> {
    // Appel PUT vers /api/evenement/{id}
    const response = await api.put<Evenement>(`/api/evenement/${id}`, data);
    return response.data;
  },

  /**
   * Supprime définitivement un événement.
   * Attention : Cette action est irréversible.
   */
  async delete(id: number): Promise<void> {
    // Appel DELETE vers /api/evenement/{id}
    await api.delete(`/api/evenement/${id}`);
  },

  /**
   * Récupère uniquement les événements créés par un organisateur précis.
   * C'est très utile pour le "Tableau de bord Organisateur" afin qu'il ne voit que SES événements.
   * @param orgId - L'ID de l'organisateur.
   */
  async getByOrganisateur(orgId: number): Promise<Evenement[]> {
    // Appel GET vers une route spécifique créée dans le backend pour filtrer par organisateur
    const response = await api.get<Evenement[]>(`/api/evenement/organisateur/${orgId}`);
    return response.data;
  }
};