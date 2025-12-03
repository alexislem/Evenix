import { api } from '../utils/api';
import { TypeEvenement } from '../types';

export const typeEvenementService = {
  async getAll(): Promise<TypeEvenement[]> {
    const response = await api.get<TypeEvenement[]>('/api/type-evenement/all');
    return response.data;
  }
};