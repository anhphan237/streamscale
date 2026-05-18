import { useEffect, useState } from 'react';
import { videoApi } from '../api/videoApi';
import VideoRow from '../components/VideoRow';
import type { Video } from '../types/video';

export default function HomePage() {
  const [latest, setLatest] = useState<Video[]>([]);
  const [trending, setTrending] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([videoApi.getLatest(), videoApi.getTrending()])
      .then(([latestRes, trendingRes]) => {
        setLatest(latestRes.data);
        setTrending(trendingRes.data);
      })
      .catch(() => setError('Could not load videos'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <main className="home-page">Loading…</main>;
  if (error) return <main className="home-page">{error}</main>;

  return (
    <main className="home-page">
      <h1>StreamScale</h1>
      <VideoRow title="Latest" videos={latest} />
      <VideoRow title="Trending" videos={trending} />
    </main>
  );
}
