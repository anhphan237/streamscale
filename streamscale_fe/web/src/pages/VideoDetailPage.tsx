import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { videoApi } from '../api/videoApi';
import AppHeader from '../components/AppHeader';
import VideoDetailContent from '../components/VideoDetailContent';
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
      .catch(() => setError('Video không tồn tại hoặc chưa published'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <AppHeader />
        <main className="video-detail-page">Đang tải…</main>
      </>
    );
  }

  if (error || !video) {
    return (
      <>
        <AppHeader />
        <main className="video-detail-page">{error}</main>
      </>
    );
  }

  return (
    <>
      <AppHeader />
      <main className="video-detail-page">
        <VideoDetailContent video={video} />
      </main>
    </>
  );
}
