import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { genreApi } from '../api/genreApi';
import { videoApi } from '../api/videoApi';
import AdminVideoForm from '../components/AdminVideoForm';
import AppHeader from '../components/AppHeader';
import type { Genre, VideoCreateRequest } from '../types/video';

const emptyForm: VideoCreateRequest = {
  title: '',
  description: '',
  type: 'MOVIE',
  status: 'PUBLISHED',
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
      setMessage(
        form.status === 'PUBLISHED'
          ? 'Đã tạo video — metadata sẽ hiện trên home.'
          : 'Đã lưu draft — publish để hiện trên home.',
      );
      setForm(emptyForm);
    } catch {
      setError('Tạo video thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppHeader />
      <main className="admin-page">
        <p>
          <Link to="/admin/videos">← Quay lại danh sách</Link>
        </p>
        <h1>Tạo video mới</h1>
        <AdminVideoForm
          form={form}
          genres={genres}
          onChange={setForm}
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Tạo video"
          message={message}
          error={error}
        />
      </main>
    </>
  );
}
