import { api } from '../utils/api';
import { Entreprise } from '../types';

/**
 * ============================================================================
 * SERVICE DE GESTION DES ENTREPRISES
 * ============================================================================
 * Ce fichier contient toutes les fonctions pour "discuter" avec la partie
 * Entreprise du serveur Java.
 * C'est ici qu'on demande la liste des entreprises, qu'on en crée ou qu'on supprime.
 * ============================================================================
 */

/**
 * DTO (Data Transfer Object) pour la CRÉATION.
 * C'est un "moule" qui définit strictement les données nécessaires pour créer une entreprise.
 * Notez qu'il n'y a pas d'ID ici, car c'est la base de données qui va le créer automatiquement.
 */
export interface CreateEntrepriseRequest {
  nom: string;
  adresse: string;
  email: string;
}

export const entrepriseService = {
  
  /**
   * Récupère la liste de TOUTES les entreprises.
   * Utile pour la page d'administration "AdminEntreprises".
   * @returns Une promesse qui contient un tableau d'entreprises.
   */
  async getAll(): Promise<Entreprise[]> {
    // On appelle la route Java GET /api/entreprise/all
    const response = await api.get<Entreprise[]>('/api/entreprise/all');
    return response.data;
  },

  /**
   * Récupère les détails d'une seule entreprise grâce à son ID unique.
   */
  async getById(id: number): Promise<Entreprise> {
    // On appelle la route Java GET /api/entreprise/{id}
    const response = await api.get<Entreprise>(`/api/entreprise/${id}`);
    return response.data;
  },

  /**
   * Envoie les données au serveur pour CRÉER une nouvelle entreprise.
   * @param data - Les informations saisies dans le formulaire (nom, adresse...)
   */
  async create(data: CreateEntrepriseRequest): Promise<Entreprise> {
    // On utilise POST car on envoie des données pour créer une ressource
    const response = await api.post<Entreprise>('/api/entreprise', data);
    // Le serveur nous renvoie l'entreprise créée (avec son nouvel ID !)
    return response.data;
  },

  /**
   * ⚠️ NOTE DÉVELOPPEUR :
   * La fonction de mise à jour (Update) est prête côté Frontend,
   * mais elle est commentée car le Backend Java n'a pas encore créé la route "PUT".
   * Si on l'activait maintenant, cela créerait une erreur 405 ou 404.
   */
  /*
  async update(id: number, data: Partial<CreateEntrepriseRequest>): Promise<Entreprise> {
    const response = await api.put<Entreprise>(`/api/entreprise/${id}`, data);
    return response.data;
  },
  */

  /**
   * Demande au serveur de SUPPRIMER une entreprise.
   * @param id - L'identifiant unique de l'entreprise à effacer.
   */
  async delete(id: number): Promise<void> {
    // On utilise la méthode DELETE HTTP
    await api.delete(`/api/entreprise/${id}`);
    // On ne retourne rien (void) car une fois supprimé, il n'y a plus de données.
  },
};