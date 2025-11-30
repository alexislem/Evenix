import { api } from '../utils/api';
import { Utilisateur } from '../types';

export const utilisateurService = {
  async getAll(): Promise<Utilisateur[]> {
    const response = await api.get<Utilisateur[]>('/api/utilisateur/all');
    return response.data;
  },

  async getById(id: number): Promise<Utilisateur> {
    const response = await api.get<Utilisateur>(`/api/utilisateur/${id}`);
    return response.data;
  },

  async create(data: Partial<Utilisateur>): Promise<Utilisateur> {
    const response = await api.post<Utilisateur>('/api/utilisateur', data);
    return response.data;
  },

  async update(id: number, data: Partial<Utilisateur>): Promise<Utilisateur> {
    const response = await api.put<Utilisateur>(`/api/utilisateur/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/utilisateur/${id}`);
  },

  async updateRole(id: number, roleId: number): Promise<Utilisateur> {
    const response = await api.put<Utilisateur>(`api/utilisateur/${id}/role`, { roleId });
    return response.data;
  },
};
