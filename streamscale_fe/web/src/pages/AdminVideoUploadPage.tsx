import { isAxiosError } from 'axios';
import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { uploadVideo } from '../api/uploadApi';
import AppHeader from '../components/AppHeader';

function uploadErrorMessage(err: unknown): string {
  if (isAxiosError(err)) {
    const msg = err.response?.data?.message;
    if (typeof msg === 'string') return msg;
    if (err.response?.status === 403) {
      return 'Forbidden — chỉ ADMIN được upload.';
    }
  }
  return 'Upload failed';
}

export default function AdminVideoUploadPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'MOVIE' | 'SERIES'>('MOVIE');
  const [releaseYear, setReleaseYear] = useState('');
  const [durationSeconds, setDurationSeconds] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!file) {
      setError('Please select an MP4 file');
      setMessage('');
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      setError('');

      const result = await uploadVideo({
        title,
        description: description || undefined,
        type,
        releaseYear: releaseYear ? Number(releaseYear) : undefined,
        durationSeconds: durationSeconds ? Number(durationSeconds) : undefined,
        file,
      });

      setMessage(
        `Upload success. Video ID: ${result.videoId}, status: ${result.status}`,
      );
    } catch (err) {
      setError(uploadErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AppHeader />
      <main className="admin-page">
        <div className="admin-page__toolbar">
          <h1>Upload Video</h1>
          <Link to="/admin/videos" className="admin-page__link-btn">
            ← Back to list
          </Link>
        </div>

        <p className="admin-page__hint">
          Upload MP4 gốc lên MinIO. Sau upload, video có status{' '}
          <strong>UPLOADED</strong> (chưa phát cho user).
        </p>

        <form onSubmit={handleSubmit} className="admin-video-form">
          <section className="admin-video-form__section">
            <h2>Metadata</h2>
            <label>
              Title
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>
            <label>
              Description
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
            <label>
              Type
              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value as 'MOVIE' | 'SERIES')
                }
              >
                <option value="MOVIE">MOVIE</option>
                <option value="SERIES">SERIES</option>
              </select>
            </label>
            <div className="admin-video-form__row">
              <label>
                Release Year
                <input
                  type="number"
                  value={releaseYear}
                  onChange={(e) => setReleaseYear(e.target.value)}
                />
              </label>
              <label>
                Duration (seconds)
                <input
                  type="number"
                  value={durationSeconds}
                  onChange={(e) => setDurationSeconds(e.target.value)}
                />
              </label>
            </div>
          </section>

          <section className="admin-video-form__section">
            <h2>MP4 file</h2>
            <label>
              File
              <input
                type="file"
                accept="video/mp4,.mp4"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                required
              />
            </label>
          </section>

          <button type="submit" disabled={loading}>
            {loading ? 'Uploading…' : 'Upload'}
          </button>

          {message && <p className="admin-video-form__success">{message}</p>}
          {error && <p className="admin-page__error">{error}</p>}
        </form>
      </main>
    </>
  );
}
