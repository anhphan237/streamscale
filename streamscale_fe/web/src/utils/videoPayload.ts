import type { VideoCreateRequest, VideoUpdateRequest } from '../types/video';

/** Gửi đủ metadata cho PUT — tránh backend bỏ qua field vì thiếu trong JSON. */
export function toVideoUpdatePayload(
  form: VideoCreateRequest,
): VideoUpdateRequest {
  return {
    title: form.title,
    description: form.description ?? '',
    type: form.type,
    status: form.status,
    thumbnailUrl: form.thumbnailUrl ?? '',
    trailerUrl: form.trailerUrl ?? '',
    releaseYear: form.releaseYear ?? null,
    durationSeconds: form.durationSeconds ?? null,
    genreIds: form.genreIds ?? [],
  };
}
