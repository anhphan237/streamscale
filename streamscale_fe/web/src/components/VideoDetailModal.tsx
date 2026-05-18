import { useEffect } from 'react';
import VideoDetailContent from './VideoDetailContent';
import type { Video } from '../types/video';

interface VideoDetailModalProps {
  video: Video;
  onClose: () => void;
}

export default function VideoDetailModal({ video, onClose }: VideoDetailModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div
      className="video-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
      onClick={onClose}
    >
      <div className="video-modal__panel" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="video-modal__close"
          onClick={onClose}
          aria-label="Đóng"
        >
          ×
        </button>
        <VideoDetailContent video={video} showFullPageLink />
      </div>
    </div>
  );
}

