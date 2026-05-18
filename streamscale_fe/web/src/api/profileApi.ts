import axiosClient from './axiosClient';
import type { Profile, ProfileRequest } from '../types/profile';

export const profileApi = {
  getMyProfiles: () => axiosClient.get<Profile[]>('/api/profiles'),

  create: (data: ProfileRequest) =>
    axiosClient.post<Profile>('/api/profiles', data),

  update: (id: number, data: ProfileRequest) =>
    axiosClient.put<Profile>(`/api/profiles/${id}`, data),

  delete: (id: number) => axiosClient.delete(`/api/profiles/${id}`),
};
