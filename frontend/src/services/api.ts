import { Superhero, SuperheroInput, PaginatedResponse } from '../types/superhero';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = {
  async getSuperheroes(page = 1, limit = 5): Promise<PaginatedResponse> {
    const response = await fetch(`${API_BASE_URL}/superheroes?limit=${limit}&page=${page}`);
    if (!response.ok) {
      throw new Error('Failed to fetch superheroes');
    }
    return response.json();
  },

  async getSuperheroById(id: string): Promise<Superhero> {
    const response = await fetch(`${API_BASE_URL}/superheroes/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch superhero');
    }
    return response.json();
  },

  async createSuperhero(superhero: SuperheroInput): Promise<Superhero> {
    const response = await fetch(`${API_BASE_URL}/superheroes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(superhero),
    });
    if (!response.ok) {
      throw new Error('Failed to create superhero');
    }
    return response.json();
  },

  async updateSuperhero(id: string, superhero: SuperheroInput): Promise<Superhero> {
    const response = await fetch(`${API_BASE_URL}/superheroes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(superhero),
    });
    if (!response.ok) {
      throw new Error('Failed to update superhero');
    }
    return response.json();
  },

  async deleteSuperhero(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/superheroes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete superhero');
    }
  },
};