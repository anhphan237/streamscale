import axiosClient from './axiosClient';
import type { Video, VideoCreateRequest, VideoUpdateRequest } from '../types/video';

export const videoApi = {
  getVideos: () => axiosClient.get<Video[]>('/api/videos'),

  getVideoDetail: (id: number) => axiosClient.get<Video>(`/api/videos/${id}`),

  getLatest: () => axiosClient.get<Video[]>('/api/videos/latest'),

  getTrending: () => axiosClient.get<Video[]>('/api/videos/trending'),

  getAllAdmin: () => axiosClient.get<Video[]>('/api/admin/videos'),

  getAdminDetail: (id: number) =>
    axiosClient.get<Video>(`/api/admin/videos/${id}`),

  create: (data: VideoCreateRequest) =>
    axiosClient.post<Video>('/api/admin/videos', data),

  update: (id: number, data: VideoUpdateRequest) =>
    axiosClient.put<Video>(`/api/admin/videos/${id}`, data),

  delete: (id: number) => axiosClient.delete(`/api/admin/videos/${id}`),
};
