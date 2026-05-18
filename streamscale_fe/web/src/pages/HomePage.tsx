import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { genreApi } from '../api/genreApi';
import { videoApi } from '../api/videoApi';
import AppHeader from '../components/AppHeader';
import GenreRow from '../components/GenreRow';
import HeroBanner from '../components/HeroBanner';
import VideoDetailModal from '../components/VideoDetailModal';
import VideoRow from '../components/VideoRow';
import type { Genre, Video } from '../types/video';

export default function HomePage() {
  const [all, setAll] = useState<Video[]>([]);
  const [latest, setLatest] = useState<Video[]>([]);
  const [trending, setTrending] = useState<Video[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [modalVideo, setModalVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      videoApi.getVideos(),
      videoApi.getLatest(),
      videoApi.getTrending(),
      genreApi.getAll(),
    ])
      .then(([allRes, latestRes, trendingRes, genresRes]) => {
        setAll(allRes.data);
        setLatest(latestRes.data);
        setTrending(trendingRes.data);
        setGenres(genresRes.data);
      })
      .catch(() => setError('Không tải được catalog'))
      .finally(() => setLoading(false));
  }, []);

  const heroVideo = trending[0] ?? latest[0] ?? all[0] ?? null;
  const hasAny =
    all.length > 0 || latest.length > 0 || trending.length > 0;

  if (loading) {
    return (
      <>
        <AppHeader />
        <main className="home-page home-page--loading">Đang tải…</main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AppHeader />
        <main className="home-page">{error}</main>
      </>
    );
  }

  return (
    <>
      <AppHeader />
      <main className="home-page">
        <HeroBanner video={heroVideo} onPlay={setModalVideo} />

        {!hasAny && (
          <p className="home-page__empty">
            Chưa có video published. Admin tạo video với status{' '}
            <strong>Published</strong>.
          </p>
        )}

        <VideoRow
          title="Trending"
          videos={trending}
          onOpenVideo={setModalVideo}
        />
        <VideoRow
          title="Latest"
          videos={latest}
          onOpenVideo={setModalVideo}
        />
        <VideoRow title="Tất cả" videos={all} onOpenVideo={setModalVideo} />

        {genres.map((genre) => (
          <GenreRow
            key={genre.id}
            genre={genre}
            videos={all}
            onOpenVideo={setModalVideo}
          />
        ))}

        {!hasAny && (
          <p className="home-page__empty">
            <Link to="/admin/videos">Admin → Quản lý video</Link>
          </p>
        )}
      </main>

      {modalVideo && (
        <VideoDetailModal
          video={modalVideo}
          onClose={() => setModalVideo(null)}
        />
      )}
    </>
  );
}
