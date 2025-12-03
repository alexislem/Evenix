import { api } from '../utils/api';
import { Lieu } from '../types';

export const lieuService = {
  // Récupérer tous les lieux
  async getAll(): Promise<Lieu[]> {
    const response = await api.get<Lieu[]>('/api/lieu/all');
    return response.data;
  },

  // Récupérer un lieu par ID
  async getById(id: number): Promise<Lieu> {
    const response = await api.get<Lieu>(`/api/lieu/${id}`);
    return response.data;
  }, 

  // Créer un lieu
  // On utilise Omit pour exclure l'ID qui est généré par le backend
  async create(data: Omit<Lieu, 'id'>): Promise<Lieu> {
    const response = await api.post<Lieu>('/api/lieu', data);
    return response.data;
  },

  // Mettre à jour un lieu
  async update(id: number, data: Partial<Lieu>): Promise<Lieu> {
    const response = await api.put<Lieu>(`/api/lieu/${id}`, data);
    return response.data;
  },

  // Supprimer un lieu
  async delete(id: number): Promise<void> {
    await api.delete(`/api/lieu/${id}`);
  }
};