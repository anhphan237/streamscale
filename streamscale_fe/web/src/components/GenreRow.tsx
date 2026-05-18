import type { Genre, Video } from '../types/video';
import VideoRow from './VideoRow';

interface GenreRowProps {
  genre: Genre;
  videos: Video[];
  onOpenVideo?: (video: Video) => void;
}

export default function GenreRow({ genre, videos, onOpenVideo }: GenreRowProps) {
  const inGenre = videos.filter((v) => v.genres.some((g) => g.id === genre.id));
  return (
    <VideoRow title={genre.name} videos={inGenre} onOpenVideo={onOpenVideo} />
  );
}
