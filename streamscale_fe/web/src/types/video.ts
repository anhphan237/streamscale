export type VideoType = 'MOVIE' | 'SERIES';
export type VideoStatus = 'DRAFT' | 'UPLOADED' | 'READY' | 'PUBLISHED';

export interface Genre {
  id: number;
  name: string;
}

export interface Video {
  id: number;
  title: string;
  description: string | null;
  type: VideoType;
  status: VideoStatus;
  thumbnailUrl: string | null;
  trailerUrl: string | null;
  durationSeconds: number | null;
  releaseYear: number | null;
  originalFileUrl?: string | null;
  originalFileName?: string | null;
  originalFileSize?: number | null;
  genres: Genre[];
}

export interface VideoUpdateRequest {
  title?: string;
  description?: string;
  type?: VideoType;
  status?: VideoStatus;
  thumbnailUrl?: string;
  trailerUrl?: string;
  durationSeconds?: number | null;
  releaseYear?: number | null;
  genreIds?: number[];
}

export interface VideoCreateRequest {
  title: string;
  description?: string;
  type: VideoType;
  status: VideoStatus;
  thumbnailUrl?: string;
  trailerUrl?: string;
  durationSeconds?: number;
  releaseYear?: number;
  genreIds?: number[];
}
