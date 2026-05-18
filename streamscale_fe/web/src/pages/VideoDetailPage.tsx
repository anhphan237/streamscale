import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { videoApi } from '../api/videoApi';
import AppHeader from '../components/AppHeader';
import type { Video } from '../types/video';

export default function VideoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    videoApi
      .getVideoDetail(Number(id))
      .then((res) => setVideo(res.data))
      .catch(() => setError('Video not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <main className="video-detail-page">Loading…</main>;
  if (error || !video) return <main className="video-detail-page">{error}</main>;

  return (
    <>
      <AppHeader />
      <main className="video-detail-page">
      {video.thumbnailUrl && (
        <img
          className="video-detail-page__hero"
          src={video.thumbnailUrl}
          alt={video.title}
        />
      )}
      <h1>{video.title}</h1>
      <dl className="video-detail-page__meta">
        <div>
          <dt>Loại</dt>
          <dd>{video.type === 'MOVIE' ? 'Phim' : 'Series'}</dd>
        </div>
        {video.releaseYear != null && (
          <div>
            <dt>Năm</dt>
            <dd>{video.releaseYear}</dd>
          </div>
        )}
        {video.durationSeconds != null && video.durationSeconds > 0 && (
          <div>
            <dt>Thời lượng</dt>
            <dd>
              {Math.floor(video.durationSeconds / 60)} phút{' '}
              {video.durationSeconds % 60} giây
            </dd>
          </div>
        )}
        {video.genres.length > 0 && (
          <div>
            <dt>Thể loại</dt>
            <dd>{video.genres.map((g) => g.name).join(' · ')}</dd>
          </div>
        )}
      </dl>
      {video.description && <p className="video-detail-page__desc">{video.description}</p>}
      {video.trailerUrl && (
        <a href={video.trailerUrl} target="_blank" rel="noreferrer">
          Watch trailer
        </a>
      )}
      </main>
    </>
  );
}
