import type { FormEvent } from 'react';
import type { Genre, VideoCreateRequest, VideoStatus, VideoType } from '../types/video';

interface AdminVideoFormProps {
  form: VideoCreateRequest;
  genres: Genre[];
  onChange: (form: VideoCreateRequest) => void;
  onSubmit: (e: FormEvent) => void;
  loading: boolean;
  submitLabel: string;
  message?: string;
  error?: string;
}

export default function AdminVideoForm({
  form,
  genres,
  onChange,
  onSubmit,
  loading,
  submitLabel,
  message,
  error,
}: AdminVideoFormProps) {
  const toggleGenre = (genreId: number) => {
    const ids = form.genreIds ?? [];
    onChange({
      ...form,
      genreIds: ids.includes(genreId)
        ? ids.filter((id) => id !== genreId)
        : [...ids, genreId],
    });
  };

  return (
    <form onSubmit={onSubmit} className="admin-video-form">
      <section className="admin-video-form__section">
        <h2>Thông tin cơ bản</h2>
        <label>
          Tiêu đề
          <input
            value={form.title}
            onChange={(e) => onChange({ ...form, title: e.target.value })}
            required
          />
        </label>
        <label>
          Mô tả
          <textarea
            rows={4}
            value={form.description ?? ''}
            onChange={(e) => onChange({ ...form, description: e.target.value })}
          />
        </label>
      </section>

      <section className="admin-video-form__section">
        <h2>Phân loại</h2>
        <label>
          Loại
          <select
            value={form.type}
            onChange={(e) =>
              onChange({ ...form, type: e.target.value as VideoType })
            }
          >
            <option value="MOVIE">Phim (Movie)</option>
            <option value="SERIES">Series</option>
          </select>
        </label>
        <label>
          Trạng thái
          <select
            value={form.status}
            onChange={(e) =>
              onChange({ ...form, status: e.target.value as VideoStatus })
            }
          >
            <option value="DRAFT">Draft — ẩn trên home</option>
            <option value="PUBLISHED">Published — hiện trên home</option>
          </select>
        </label>
        <fieldset>
          <legend>Thể loại</legend>
          {genres.length === 0 && (
            <p className="admin-video-form__muted">Chưa có genre trong hệ thống.</p>
          )}
          {genres.map((genre) => (
            <label key={genre.id} className="admin-video-form__checkbox">
              <input
                type="checkbox"
                checked={form.genreIds?.includes(genre.id) ?? false}
                onChange={() => toggleGenre(genre.id)}
              />
              {genre.name}
            </label>
          ))}
        </fieldset>
      </section>

      <section className="admin-video-form__section">
        <h2>Media &amp; metadata</h2>
        <label>
          Thumbnail URL
          <input
            type="url"
            placeholder="https://..."
            value={form.thumbnailUrl ?? ''}
            onChange={(e) =>
              onChange({ ...form, thumbnailUrl: e.target.value })
            }
          />
        </label>
        <label>
          Trailer URL
          <input
            type="url"
            placeholder="https://..."
            value={form.trailerUrl ?? ''}
            onChange={(e) => onChange({ ...form, trailerUrl: e.target.value })}
          />
        </label>
        <div className="admin-video-form__row">
          <label>
            Năm phát hành
            <input
              type="number"
              min={1900}
              max={2100}
              value={form.releaseYear ?? ''}
              onChange={(e) =>
                onChange({
                  ...form,
                  releaseYear: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
            />
          </label>
          <label>
            Thời lượng (giây)
            <input
              type="number"
              min={0}
              value={form.durationSeconds ?? ''}
              onChange={(e) =>
                onChange({
                  ...form,
                  durationSeconds: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
            />
          </label>
        </div>
        {form.durationSeconds != null && form.durationSeconds > 0 && (
          <p className="admin-video-form__muted">
            ≈ {Math.floor(form.durationSeconds / 60)} phút{' '}
            {form.durationSeconds % 60} giây
          </p>
        )}
      </section>

      {message && <p className="admin-video-form__success">{message}</p>}
      {error && <p className="admin-page__error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Đang lưu…' : submitLabel}
      </button>
    </form>
  );
}
