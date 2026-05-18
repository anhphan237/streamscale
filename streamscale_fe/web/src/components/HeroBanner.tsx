import { Link } from 'react-router-dom';
import type { Video } from '../types/video';

interface HeroBannerProps {
  video: Video | null;
  onPlay?: (video: Video) => void;
}

export default function HeroBanner({ video, onPlay }: HeroBannerProps) {
  if (!video) return null;

  return (
    <section
      className="hero"
      style={
        video.thumbnailUrl
          ? {
              backgroundImage: `linear-gradient(to top, var(--bg) 10%, transparent 50%), url(${video.thumbnailUrl})`,
            }
          : undefined
      }
    >
      <div className="hero__content">
        <p className="hero__eyebrow">Nổi bật</p>
        <h1 className="hero__title">{video.title}</h1>
        {video.description && (
          <p className="hero__desc">
            {video.description.length > 160
              ? `${video.description.slice(0, 160)}…`
              : video.description}
          </p>
        )}
        <div className="hero__actions">
          {onPlay && (
            <button type="button" className="hero__btn" onClick={() => onPlay(video)}>
              ▶ Xem ngay
            </button>
          )}
          <Link className="hero__btn hero__btn--secondary" to={`/videos/${video.id}`}>
            Thông tin
          </Link>
        </div>
      </div>
    </section>
  );
}
