import { api } from '../utils/api';
import { Inscription } from '../types';

/**
 * ============================================================================
 * SERVICE DE GESTION DES INSCRIPTIONS (BILLETS)
 * ============================================================================
 * Ce fichier gère le lien entre un utilisateur et un événement.
 * C'est ici qu'on réserve sa place ou qu'on annule sa venue.
 * ============================================================================
 */

export const inscriptionService = {
  
  /**
   * Crée une nouvelle inscription (l'utilisateur réserve sa place).
   * * * ⚠️ PARTICULARITÉ BACKEND :
   * Le contrôleur Java (InscriptionController) n'attend pas un objet JSON dans le corps.
   * Il attend deux paramètres précis dans l'URL (Query Parameters) : "userId" et "eventId".
   * C'est pour cela qu'on construit l'URL avec des `?` et des `&`.
   * * @param utilisateurId - L'ID de la personne qui s'inscrit.
   * @param evenementId - L'ID de l'événement.
   * @returns L'objet Inscription créé (avec son ID, la date, le statut...).
   */
  async create(utilisateurId: number, evenementId: number): Promise<Inscription> {
    // Appel POST vers /api/inscription?userId=1&eventId=5
    const response = await api.post<Inscription>(
      `/api/inscription?userId=${utilisateurId}&eventId=${evenementId}`
    );
    return response.data;
  },

  /**
   * Récupère tout l'historique des inscriptions d'un utilisateur.
   * C'est cette fonction qui alimente la page "Mes Inscriptions" et 
   * permet de savoir si on met le badge "Inscrit" sur une carte événement.
   * * @param utilisateurId - L'ID de l'utilisateur dont on veut voir l'historique.
   */
  async getByUser(utilisateurId: number): Promise<Inscription[]> {
    // Appel GET vers /api/inscription/user/{id}
    const response = await api.get<Inscription[]>(`/api/inscription/user/${utilisateurId}`);
    return response.data;
  },

  /**
   * Annule une inscription (Désinscription).
   * Cela libère une place pour l'événement.
   * * @param inscriptionId - L'ID unique de l'inscription (PAS l'ID de l'événement, ni de l'user !).
   */
  async delete(inscriptionId: number): Promise<void> {
    // Appel DELETE vers /api/inscription/{id}
    await api.delete(`/api/inscription/${inscriptionId}`);
  }
};