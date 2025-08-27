export interface Superhero {
  _id: string;
  nickname: string;
  real_name: string;
  origin_description: string;
  superpowers: string[];
  catch_phrase: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SuperheroInput {
  nickname: string;
  real_name: string;
  origin_description: string;
  superpowers: string[];
  catch_phrase: string;
  images: string[];
}

export interface PaginatedResponse {
  data: Array<{
    id: string;
    nickname: string;
    image?: string;
  }>;
  total: number;
  page: number;
  limit: number;
}