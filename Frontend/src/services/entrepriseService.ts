import { api } from '../utils/api';
import { Entreprise } from '../types';

// On définit le DTO de création pour qu'il colle au backend (EntrepriseDTO.java)
export interface CreateEntrepriseRequest {
  nom: string;
  adresse: string;
  email: string;
}

export const entrepriseService = {
  async getAll(): Promise<Entreprise[]> {
    const response = await api.get<Entreprise[]>('/api/entreprise/all');
    return response.data;
  },

  async getById(id: number): Promise<Entreprise> {
    const response = await api.get<Entreprise>(`/api/entreprise/${id}`);
    return response.data;
  },

  async create(data: CreateEntrepriseRequest): Promise<Entreprise> {
    const response = await api.post<Entreprise>('/api/entreprise', data);
    return response.data;
  },

  // ⚠️ ATTENTION : Le backend "EntrepriseController" généré précédemment n'a pas de méthode @PutMapping.
  // Je laisse le code commenté ici. Si vous ajoutez le PUT côté Java, vous pourrez décommenter.
  /*
  async update(id: number, data: Partial<CreateEntrepriseRequest>): Promise<Entreprise> {
    const response = await api.put<Entreprise>(`/api/entreprise/${id}`, data);
    return response.data;
  },
  */

  async delete(id: number): Promise<void> {
    await api.delete(`/api/entreprise/${id}`);
  },
};