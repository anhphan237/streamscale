import axiosClient from './axiosClient';

export type UploadVideoRequest = {
  title: string;
  description?: string;
  type: 'MOVIE' | 'SERIES';
  releaseYear?: number;
  durationSeconds?: number;
  file: File;
};

export type UploadVideoResponse = {
  videoId: number;
  title: string;
  status: string;
  originalFileUrl: string;
  originalFileName: string;
  originalFileSize: number;
};

export async function uploadVideo(request: UploadVideoRequest) {
  const formData = new FormData();

  formData.append('title', request.title);
  formData.append('type', request.type);
  formData.append('file', request.file);

  if (request.description) {
    formData.append('description', request.description);
  }
  if (request.releaseYear != null) {
    formData.append('releaseYear', String(request.releaseYear));
  }
  if (request.durationSeconds != null) {
    formData.append('durationSeconds', String(request.durationSeconds));
  }

  const response = await axiosClient.post<UploadVideoResponse>(
    '/api/admin/uploads/videos',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response.data;
}
