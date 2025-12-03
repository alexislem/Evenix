import { api } from '../utils/api';
import { Entreprise, CreateEntrepriseRequest } from '../types';

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

  async update(id: number, data: Partial<CreateEntrepriseRequest>): Promise<Entreprise> {
    const response = await api.put<Entreprise>(`/api/entreprise/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/entreprise/${id}`);
  },
};
