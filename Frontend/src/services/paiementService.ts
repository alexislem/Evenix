import { api } from '../utils/api';
import { Paiement } from '../types';

// DTO spécifique pour l'envoi au backend (correspond aux champs nécessaires de PaiementDTO.java)
export interface CreatePaiementRequest {
  montant: number;
  moyenPaiement: string; // Ex: 'CARTE', 'PAYPAL'
  inscriptionId: number; // Lien vers l'inscription précédemment créée
}

export const paiementService = {
  
  // Traiter un nouveau paiement
  // Route backend : POST /api/paiement/traiter
  async create(data: CreatePaiementRequest): Promise<Paiement> {
    const response = await api.post<Paiement>('/api/paiement/traiter', data);
    return response.data;
  },

  // Récupérer un paiement par son ID
  async getById(id: number): Promise<Paiement> {
    const response = await api.get<Paiement>(`/api/paiement/${id}`);
    return response.data;
  }
};