import { api } from '../utils/api';
import { Evenement, CreateEventRequest } from '../types';

export const evenementService = {
  async getAll(): Promise<Evenement[]> {
    const response = await api.get<Evenement[]>('/api/evenement/all');
    return response.data;
  },

  async getById(id: number): Promise<Evenement> {
    const response = await api.get<Evenement>(`/api/evenement/${id}`);
    return response.data;
  },

  // Modification : Le backend attend organisateurId en paramètre d'URL
  async create(data: CreateEventRequest, organisateurId: number): Promise<Evenement> {
    const response = await api.post<Evenement>(`/api/evenement?organisateurId=${organisateurId}`, data);
    return response.data;
  },

  async update(id: number, data: Partial<CreateEventRequest>): Promise<Evenement> {
    const response = await api.put<Evenement>(`/api/evenement/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/evenement/${id}`);
  },

  // Ajout : Méthode nécessaire pour l'OrganizerDashboard
  async getByOrganisateur(orgId: number): Promise<Evenement[]> {
    const response = await api.get<Evenement[]>(`/api/evenement/organisateur/${orgId}`);
    return response.data;
  }
};