import { Link } from 'react-router-dom';
import type { Video } from '../types/video';

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <Link to={`/videos/${video.id}`} className="video-card">
      {video.thumbnailUrl ? (
        <img src={video.thumbnailUrl} alt={video.title} />
      ) : (
        <div className="video-card__placeholder">{video.title}</div>
      )}
      <span className="video-card__title">{video.title}</span>
    </Link>
  );
}
