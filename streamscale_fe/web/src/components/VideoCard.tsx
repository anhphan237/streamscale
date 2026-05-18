import { Link } from 'react-router-dom';
import type { Video } from '../types/video';

interface VideoCardProps {
  video: Video;
  onOpen?: (video: Video) => void;
}

export default function VideoCard({ video, onOpen }: VideoCardProps) {
  const thumb = video.thumbnailUrl ? (
    <img src={video.thumbnailUrl} alt={video.title} />
  ) : (
    <div className="video-card__placeholder">{video.title}</div>
  );

  const title = <span className="video-card__title">{video.title}</span>;

  if (onOpen) {
    return (
      <button
        type="button"
        className="video-card video-card--button"
        onClick={() => onOpen(video)}
      >
        {thumb}
        {title}
      </button>
    );
  }

  return (
    <Link to={`/videos/${video.id}`} className="video-card">
      {thumb}
      {title}
    </Link>
  );
}
