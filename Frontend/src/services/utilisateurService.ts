import { api } from '../utils/api';
import { Utilisateur } from '../types';

/**
 * ============================================================================
 * SERVICE DE GESTION DES UTILISATEURS
 * ============================================================================
 * Ce fichier permet de gérer les comptes existants.
 * Il est principalement utilisé par :
 * 1. L'Administrateur (pour voir la liste des inscrits, les supprimer...)
 * 2. L'Utilisateur lui-même (pour voir ses infos détaillées).
 * * Note : Pour créer un compte, on passe par authService.register().
 * ============================================================================
 */

export const utilisateurService = {
  
  /**
   * Récupère la liste de TOUS les utilisateurs inscrits.
   * Cette fonction est généralement réservée à l'Administrateur (AdminUsers).
   * @returns Une promesse contenant un tableau d'utilisateurs.
   */
  async getAll(): Promise<Utilisateur[]> {
    // Appel GET vers /api/utilisateur/all
    const response = await api.get<Utilisateur[]>('/api/utilisateur/all');
    return response.data;
  },

  /**
   * Récupère les détails d'un utilisateur spécifique via son ID.
   * @param id - L'identifiant de l'utilisateur.
   */
  async getById(id: number): Promise<Utilisateur> {
    // Appel GET vers /api/utilisateur/{id}
    const response = await api.get<Utilisateur>(`/api/utilisateur/${id}`);
    return response.data;
  },

  /**
   * Met à jour les informations d'un utilisateur.
   * * * 🎓 NOTE TYPESCRIPT : "Partial<Utilisateur>"
   * Cela signifie qu'on peut envoyer seulement une partie des infos.
   * Exemple : on peut envoyer juste `{ telephone: "06..." }` sans devoir renvoyer tout le reste.
   * * * 💡 ASTUCE : Pour changer le rôle d'un utilisateur (Admin seulement),
   * on passe un objet rôle complet dans `data` :
   * update(id, { role: { id: 2, nom: 'ORGANISATEUR' } } as any)
   */
  async update(id: number, data: Partial<Utilisateur>): Promise<Utilisateur> {
    // Appel PUT vers /api/utilisateur/{id}
    const response = await api.put<Utilisateur>(`/api/utilisateur/${id}`, data);
    return response.data;
  },

  /**
   * Supprime définitivement un compte utilisateur.
   * Généralement réservé à l'Administrateur.
   * @param id - L'ID de l'utilisateur à supprimer.
   */
  async delete(id: number): Promise<void> {
    // Appel DELETE vers /api/utilisateur/{id}
    await api.delete(`/api/utilisateur/${id}`);
  },

  // Note pour l'équipe :
  // Il n'y a pas de méthode 'create' ici car la création d'un utilisateur
  // est une procédure spéciale (hachage de mot de passe, etc.) qui passe
  // par l'inscription : authService.register().
};