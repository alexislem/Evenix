import { api } from '../utils/api';
import { Utilisateur } from '../types';

export const utilisateurService = {
  // Récupérer tous les utilisateurs (Admin)
  async getAll(): Promise<Utilisateur[]> {
    const response = await api.get<Utilisateur[]>('/api/utilisateur/all');
    return response.data;
  },

  // Récupérer un utilisateur par ID
  async getById(id: number): Promise<Utilisateur> {
    const response = await api.get<Utilisateur>(`/api/utilisateur/${id}`);
    return response.data;
  },

  // Mettre à jour un utilisateur (y compris son rôle si Admin)
  // Utiliser ceci pour changer le rôle : update(id, { role: { id: 2, nom: 'ORGANISATEUR' } } as any)
  async update(id: number, data: Partial<Utilisateur>): Promise<Utilisateur> {
    const response = await api.put<Utilisateur>(`/api/utilisateur/${id}`, data);
    return response.data;
  },

  // Supprimer un utilisateur
  async delete(id: number): Promise<void> {
    await api.delete(`/api/utilisateur/${id}`);
  },

  // Note : Il n'y a pas de méthode 'create' ici car la création passe par l'inscription (authService.register)
};