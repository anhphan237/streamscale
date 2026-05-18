import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { isAxiosError } from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { genreApi } from '../api/genreApi';
import { videoApi } from '../api/videoApi';
import AdminVideoForm from '../components/AdminVideoForm';
import AppHeader from '../components/AppHeader';
import type { Genre, VideoCreateRequest } from '../types/video';
import { toVideoUpdatePayload } from '../utils/videoPayload';

function videoToForm(video: {
  title: string;
  description: string | null;
  type: VideoCreateRequest['type'];
  status: VideoCreateRequest['status'];
  thumbnailUrl: string | null;
  trailerUrl: string | null;
  durationSeconds: number | null;
  releaseYear: number | null;
  genres: { id: number }[];
}): VideoCreateRequest {
  return {
    title: video.title,
    description: video.description ?? '',
    type: video.type,
    status: video.status,
    thumbnailUrl: video.thumbnailUrl ?? '',
    trailerUrl: video.trailerUrl ?? '',
    durationSeconds: video.durationSeconds ?? undefined,
    releaseYear: video.releaseYear ?? undefined,
    genreIds: video.genres.map((g) => g.id),
  };
}

export default function AdminVideoEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const videoId = Number(id);

  const [form, setForm] = useState<VideoCreateRequest | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!id || Number.isNaN(videoId)) return;

    (async () => {
      try {
        const [video, genresRes] = await Promise.all([
          videoApi.getAdminDetailOrFromList(videoId),
          genreApi.getAll(),
        ]);
        setGenres(genresRes.data);
        setForm(videoToForm(video));
      } catch {
        setError(
          'Không tải được video. Restart backend (sửa SecurityConfig) rồi thử lại.',
        );
      } finally {
        setPageLoading(false);
      }
    })();
  }, [id, videoId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form) return;

    setMessage('');
    setError('');
    setLoading(true);
    try {
      await videoApi.update(videoId, toVideoUpdatePayload(form));
      setMessage('Đã cập nhật metadata.');
      setTimeout(() => navigate('/admin/videos'), 800);
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 403) {
        setError(
          'Lưu thất bại (403). Restart backend — pattern /api/videos/** đang chặn PUT admin.',
        );
      } else {
        setError('Cập nhật thất bại — kiểm tra backend đang chạy.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <>
        <AppHeader />
        <main className="admin-page">Loading…</main>
      </>
    );
  }

  if (!form) {
    return (
      <>
        <AppHeader />
        <main className="admin-page">
          <p className="admin-page__error">{error}</p>
          <Link to="/admin/videos">← Quay lại danh sách</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <AppHeader />
      <main className="admin-page">
        <p>
          <Link to="/admin/videos">← Quay lại danh sách</Link>
        </p>
        <h1>Sửa metadata video</h1>
        <AdminVideoForm
          form={form}
          genres={genres}
          onChange={setForm}
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Lưu metadata"
          message={message}
          error={error}
        />
      </main>
    </>
  );
}
