import { api } from '../utils/api';
import { Inscription } from '../types';

export const inscriptionService = {
  
  // Créer une inscription
  // Le backend utilise @RequestParam, donc on passe les IDs dans l'URL
  async create(utilisateurId: number, evenementId: number): Promise<Inscription> {
    const response = await api.post<Inscription>(
      `/api/inscription?userId=${utilisateurId}&eventId=${evenementId}`
    );
    return response.data;
  },

  // Récupérer toutes les inscriptions d'un utilisateur
  // Route backend : GET /api/inscription/user/{userId}
  async getByUser(utilisateurId: number): Promise<Inscription[]> {
    const response = await api.get<Inscription[]>(`/api/inscription/user/${utilisateurId}`);
    return response.data;
  },

  // Supprimer une inscription (Désinscription)
  async delete(inscriptionId: number): Promise<void> {
    await api.delete(`/api/inscription/${inscriptionId}`);
  }
};