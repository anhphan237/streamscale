import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { videoApi } from '../api/videoApi';
import AppHeader from '../components/AppHeader';
import VideoRow from '../components/VideoRow';
import type { Video } from '../types/video';

export default function HomePage() {
  const [all, setAll] = useState<Video[]>([]);
  const [latest, setLatest] = useState<Video[]>([]);
  const [trending, setTrending] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      videoApi.getVideos(),
      videoApi.getLatest(),
      videoApi.getTrending(),
    ])
      .then(([allRes, latestRes, trendingRes]) => {
        setAll(allRes.data);
        setLatest(latestRes.data);
        setTrending(trendingRes.data);
      })
      .catch(() => setError('Could not load videos'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <main className="home-page">Loading…</main>;
  if (error) return <main className="home-page">{error}</main>;

  const hasAny = all.length > 0 || latest.length > 0 || trending.length > 0;

  return (
    <>
      <AppHeader />
      <main className="home-page">
        {!hasAny && (
          <p className="home-page__empty">
            No published videos yet. Create one in Admin with status{' '}
            <strong>Published</strong>, or publish an existing draft.
          </p>
        )}
        <VideoRow title="All" videos={all} />
        <VideoRow title="Latest" videos={latest} />
        <VideoRow title="Trending" videos={trending} />
        {!hasAny && (
          <p className="home-page__empty">
            <Link to="/admin/videos">Go to Admin → Manage videos</Link>
          </p>
        )}
      </main>
    </>
  );
}
