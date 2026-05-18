import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { genreApi } from '../api/genreApi';
import { videoApi } from '../api/videoApi';
import AppHeader from '../components/AppHeader';
import type { Genre, VideoCreateRequest, VideoStatus, VideoType } from '../types/video';

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

    Promise.all([videoApi.getAdminDetail(videoId), genreApi.getAll()])
      .then(([videoRes, genresRes]) => {
        const video = videoRes.data;
        setGenres(genresRes.data);
        setForm({
          title: video.title,
          description: video.description ?? '',
          type: video.type,
          status: video.status,
          thumbnailUrl: video.thumbnailUrl ?? '',
          trailerUrl: video.trailerUrl ?? '',
          durationSeconds: video.durationSeconds ?? undefined,
          releaseYear: video.releaseYear ?? undefined,
          genreIds: video.genres.map((g) => g.id),
        });
      })
      .catch(() => setError('Không tải được video'))
      .finally(() => setPageLoading(false));
  }, [id, videoId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form) return;

    setMessage('');
    setError('');
    setLoading(true);
    try {
      await videoApi.update(videoId, form);
      setMessage('Đã cập nhật video.');
      setTimeout(() => navigate('/admin/videos'), 800);
    } catch {
      setError('Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  const toggleGenre = (genreId: number) => {
    if (!form) return;
    const ids = form.genreIds ?? [];
    setForm({
      ...form,
      genreIds: ids.includes(genreId)
        ? ids.filter((gid) => gid !== genreId)
        : [...ids, genreId],
    });
  };

  if (pageLoading) {
    return (
      <>
        <AppHeader />
        <main className="admin-page">Loading…</main>
      </>
    );
  }

  if (error && !form) {
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

  if (!form) return null;

  return (
    <>
      <AppHeader />
      <main className="admin-page">
        <p>
          <Link to="/admin/videos">← Quay lại danh sách</Link>
        </p>
        <h1>Edit video</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Title
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </label>
          <label>
            Description
            <textarea
              value={form.description ?? ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>
          <label>
            Type
            <select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value as VideoType })
              }
            >
              <option value="MOVIE">Movie</option>
              <option value="SERIES">Series</option>
            </select>
          </label>
          <label>
            Status
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as VideoStatus })
              }
            >
              <option value="DRAFT">Draft (hidden on home)</option>
              <option value="PUBLISHED">Published (visible on home)</option>
            </select>
          </label>
          <label>
            Thumbnail URL
            <input
              value={form.thumbnailUrl ?? ''}
              onChange={(e) =>
                setForm({ ...form, thumbnailUrl: e.target.value })
              }
            />
          </label>
          <label>
            Trailer URL
            <input
              value={form.trailerUrl ?? ''}
              onChange={(e) => setForm({ ...form, trailerUrl: e.target.value })}
            />
          </label>
          <label>
            Release year
            <input
              type="number"
              value={form.releaseYear ?? ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  releaseYear: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
            />
          </label>
          <label>
            Duration (seconds)
            <input
              type="number"
              value={form.durationSeconds ?? ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  durationSeconds: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
            />
          </label>
          <fieldset>
            <legend>Genres</legend>
            {genres.map((genre) => (
              <label key={genre.id}>
                <input
                  type="checkbox"
                  checked={form.genreIds?.includes(genre.id) ?? false}
                  onChange={() => toggleGenre(genre.id)}
                />
                {genre.name}
              </label>
            ))}
          </fieldset>
          {message && <p>{message}</p>}
          {error && <p className="admin-page__error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </main>
    </>
  );
}
