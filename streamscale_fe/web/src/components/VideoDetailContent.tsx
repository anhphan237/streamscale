import { Link } from 'react-router-dom';
import type { Video } from '../types/video';

interface VideoDetailContentProps {
  video: Video;
  showFullPageLink?: boolean;
}

export default function VideoDetailContent({
  video,
  showFullPageLink = false,
}: VideoDetailContentProps) {
  return (
    <>
      {video.thumbnailUrl && (
        <img
          className="video-detail__thumb"
          src={video.thumbnailUrl}
          alt={video.title}
        />
      )}
      <h2 className="video-detail__title">{video.title}</h2>
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
      {video.description && (
        <p className="video-detail-page__desc">{video.description}</p>
      )}
      <div className="video-detail__actions">
        {video.trailerUrl && (
          <a
            className="video-detail__btn"
            href={video.trailerUrl}
            target="_blank"
            rel="noreferrer"
          >
            Xem trailer
          </a>
        )}
        {showFullPageLink && (
          <Link
            className="video-detail__btn video-detail__btn--secondary"
            to={`/videos/${video.id}`}
          >
            Trang chi tiết
          </Link>
        )}
      </div>
    </>
  );
}
