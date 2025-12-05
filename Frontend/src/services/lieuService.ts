import { api } from '../utils/api';
import { Lieu } from '../types';

/**
 * ============================================================================
 * SERVICE DE GESTION DES LIEUX (SALLES, STADES, MUSÉES...)
 * ============================================================================
 * Ce fichier contient toutes les fonctions pour gérer la base de données des lieux.
 * Il sert d'intermédiaire entre nos pages React (qui affichent la carte ou le formulaire)
 * et le serveur Java qui stocke les adresses.
 * ============================================================================
 */

export const lieuService = {
  
  /**
   * Récupère la liste complète de tous les lieux enregistrés.
   * Utilisé par exemple pour afficher des marqueurs sur une carte ou 
   * remplir un menu déroulant.
   * @returns Une promesse contenant un tableau de Lieux ([]).
   */
  async getAll(): Promise<Lieu[]> {
    // Appel GET vers /api/lieu/all
    const response = await api.get<Lieu[]>('/api/lieu/all');
    return response.data;
  },

  /**
   * Récupère les détails d'un lieu spécifique grâce à son ID.
   * Utile si on veut afficher une page "Détail du lieu".
   * @param id - L'identifiant unique du lieu (ex: 5).
   */
  async getById(id: number): Promise<Lieu> {
    // Appel GET vers /api/lieu/{id}
    const response = await api.get<Lieu>(`/api/lieu/${id}`);
    return response.data;
  },

  /**
   * Crée un nouveau lieu dans la base de données.
   * * * 🎓 NOTE TYPESCRIPT : "Omit<Lieu, 'id'>"
   * Cela signifie qu'on attend un objet "Lieu" COMPLET, SAUF ('Omit') la propriété 'id'.
   * Pourquoi ? Parce qu'à la création, le lieu n'a pas encore d'ID !
   * C'est la base de données qui va lui en donner un (ex: 1, 2, 3...).
   * * @param data - Les infos du lieu (nom, adresse, capacité...) sans l'ID.
   */
  async create(data: Omit<Lieu, 'id'>): Promise<Lieu> {
    // Appel POST vers /api/lieu
    const response = await api.post<Lieu>('/api/lieu', data);
    return response.data;
  },

  /**
   * Met à jour un lieu existant.
   * * * 🎓 NOTE TYPESCRIPT : "Partial<Lieu>"
   * Cela signifie qu'on accepte un objet "Lieu" où toutes les propriétés sont OPTIONNELLES.
   * Pourquoi ? Parce qu'on a le droit de modifier seulement le nom sans toucher à l'adresse.
   * On envoie donc uniquement les champs qui ont changé.
   * * @param id - L'ID du lieu à modifier.
   * @param data - Les nouvelles données.
   */
  async update(id: number, data: Partial<Lieu>): Promise<Lieu> {
    // Appel PUT vers /api/lieu/{id}
    const response = await api.put<Lieu>(`/api/lieu/${id}`, data);
    return response.data;
  },

  /**
   * Supprime définitivement un lieu.
   * @param id - L'identifiant du lieu à effacer.
   */
  async delete(id: number): Promise<void> {
    // Appel DELETE vers /api/lieu/{id}
    await api.delete(`/api/lieu/${id}`);
  }
};