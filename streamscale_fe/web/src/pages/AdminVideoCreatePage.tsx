import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { genreApi } from '../api/genreApi';
import { videoApi } from '../api/videoApi';
import type { Genre, VideoCreateRequest, VideoStatus, VideoType } from '../types/video';

const emptyForm: VideoCreateRequest = {
  title: '',
  description: '',
  type: 'MOVIE',
  status: 'DRAFT',
  thumbnailUrl: '',
  trailerUrl: '',
  durationSeconds: undefined,
  releaseYear: undefined,
  genreIds: [],
};

export default function AdminVideoCreatePage() {
  const [form, setForm] = useState<VideoCreateRequest>(emptyForm);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    genreApi.getAll().then((res) => setGenres(res.data));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      await videoApi.create(form);
      setMessage('Video created');
      setForm(emptyForm);
    } catch {
      setError('Failed to create video');
    } finally {
      setLoading(false);
    }
  };

  const toggleGenre = (genreId: number) => {
    const ids = form.genreIds ?? [];
    setForm({
      ...form,
      genreIds: ids.includes(genreId)
        ? ids.filter((id) => id !== genreId)
        : [...ids, genreId],
    });
  };

  return (
    <main className="admin-page">
      <h1>Create video</h1>
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
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </label>
        <label>
          Thumbnail URL
          <input
            value={form.thumbnailUrl ?? ''}
            onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
          />
        </label>
        <label>
          Trailer URL
          <input
            value={form.trailerUrl ?? ''}
            onChange={(e) => setForm({ ...form, trailerUrl: e.target.value })}
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
          {loading ? 'Saving…' : 'Create'}
        </button>
      </form>
    </main>
  );
}
