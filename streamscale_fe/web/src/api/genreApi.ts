import axiosClient from './axiosClient';
import type { Genre } from '../types/video';

export const genreApi = {
  getAll: () => axiosClient.get<Genre[]>('/api/genres'),
};
