import { api } from '../utils/api';

export const paiementService = {
  async create(data: {
    montant: number;
    date: string;
    code: string;
    utilisateurId: number;
    evenementId: number;
  }) {
    const response = await api.post('/api/paiement', data);
    return response.data;
  }
};