import { api } from '../utils/api';
import { Lieu } from '../types';

export const lieuService = {
  async getAll(): Promise<Lieu[]> {
    const response = await api.get('/api/lieu/all');
    return response.data;
  }
};
