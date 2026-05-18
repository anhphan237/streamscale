import type { Video } from '../types/video';
import VideoCard from './VideoCard';

interface VideoRowProps {
  title: string;
  videos: Video[];
}

export default function VideoRow({ title, videos }: VideoRowProps) {
  if (videos.length === 0) return null;

  return (
    <section className="video-row">
      <h2 className="video-row__title">{title}</h2>
      <div className="video-row__list">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </section>
  );
}
