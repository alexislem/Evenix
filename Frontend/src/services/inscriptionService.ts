import { api } from '../utils/api';
import { Inscription } from '../types'; // Assurez-vous d'avoir le type Inscription

export const inscriptionService = {
  // Créer une inscription
  async create(utilisateurId: number, evenementId: number) {
    const payload = {
      utilisateurId: utilisateurId,
      evenementId: evenementId,
      dateInscription: new Date().toISOString()
    };
    const response = await api.post('/api/inscription', payload);
    return response.data;
  },

  // Récupérer toutes les inscriptions d'un utilisateur
  // (Nécessite un endpoint backend correspondant, ex: GET /api/inscription/utilisateur/{id})
  async getByUser(utilisateurId: number): Promise<Inscription[]> {
    const response = await api.get<Inscription[]>(`/api/inscription/utilisateur/${utilisateurId}`);
    return response.data;
  },

  // Supprimer une inscription (Désinscription)
  async delete(inscriptionId: number) {
    await api.delete(`/api/inscription/${inscriptionId}`);
  }
};