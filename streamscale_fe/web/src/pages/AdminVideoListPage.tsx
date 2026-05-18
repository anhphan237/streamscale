import { isAxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { videoApi } from '../api/videoApi';
import AppHeader from '../components/AppHeader';
import type { Video, VideoStatus } from '../types/video';

function loadVideosErrorMessage(err: unknown): string {
  if (isAxiosError(err)) {
    const status = err.response?.status;
    if (status === 403) {
      return 'Không tải được danh sách (403). Restart Spring Boot để nhận API mới, rồi đăng nhập lại bằng tài khoản ADMIN.';
    }
    if (status === 401) {
      return 'Phiên đăng nhập hết hạn — hãy đăng xuất và đăng nhập lại.';
    }
  }
  return 'Không tải được video. Kiểm tra backend đang chạy (port 8080) và thử lại.';
}

export default function AdminVideoListPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState<number | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    videoApi
      .getAllAdmin()
      .then((res) => setVideos(res.data))
      .catch((err) => setError(loadVideosErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (id: number, status: VideoStatus) => {
    setActionId(id);
    try {
      await videoApi.update(id, { status });
      await load();
    } catch {
      setError('Update failed');
    } finally {
      setActionId(null);
    }
  };

  const remove = async (id: number) => {
    if (!window.confirm('Delete this video?')) return;
    setActionId(id);
    try {
      await videoApi.delete(id);
      await load();
    } catch {
      setError('Delete failed');
    } finally {
      setActionId(null);
    }
  };

  const drafts = videos.filter((v) => v.status === 'DRAFT');
  const published = videos.filter((v) => v.status === 'PUBLISHED');

  return (
    <>
      <AppHeader />
      <main className="admin-page admin-page--list">
        <div className="admin-page__toolbar">
          <h1>Manage videos</h1>
          <Link to="/admin/videos/new" className="admin-page__link-btn">
            + New video
          </Link>
        </div>

        <p className="admin-page__hint">
          <strong>Draft</strong> — chỉ admin thấy, không hiện trang chủ.{' '}
          <strong>Published</strong> — hiện cho user trên home.
        </p>

        {error && <p className="admin-page__error">{error}</p>}
        {loading && <p>Loading…</p>}

        {!loading && !error && videos.length === 0 && (
          <p className="admin-page__empty">Chưa có video nào.</p>
        )}

        {!loading && drafts.length > 0 && (
          <section className="admin-table-section">
            <h2>Drafts ({drafts.length})</h2>
            <VideoAdminTable
              videos={drafts}
              actionId={actionId}
              onPublish={(id) => setStatus(id, 'PUBLISHED')}
              onDelete={remove}
            />
          </section>
        )}

        {!loading && published.length > 0 && (
          <section className="admin-table-section">
            <h2>Published ({published.length})</h2>
            <VideoAdminTable
              videos={published}
              actionId={actionId}
              published
              onUnpublish={(id) => setStatus(id, 'DRAFT')}
              onDelete={remove}
            />
          </section>
        )}
      </main>
    </>
  );
}

interface VideoAdminTableProps {
  videos: Video[];
  actionId: number | null;
  published?: boolean;
  onPublish?: (id: number) => void;
  onUnpublish?: (id: number) => void;
  onDelete: (id: number) => void;
}

function VideoAdminTable({
  videos,
  actionId,
  published,
  onPublish,
  onUnpublish,
  onDelete,
}: VideoAdminTableProps) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video) => (
            <tr key={video.id}>
              <td>{video.title}</td>
              <td>{video.type}</td>
              <td>
                <span
                  className={`admin-badge admin-badge--${video.status.toLowerCase()}`}
                >
                  {video.status}
                </span>
              </td>
              <td className="admin-table__actions">
                <Link
                  to={`/admin/videos/${video.id}/edit`}
                  className="admin-page__link-btn admin-btn-edit"
                >
                  Sửa metadata
                </Link>
                {!published && onPublish && (
                  <button
                    type="button"
                    disabled={actionId === video.id}
                    onClick={() => onPublish(video.id)}
                  >
                    Publish
                  </button>
                )}
                {published && onUnpublish && (
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    disabled={actionId === video.id}
                    onClick={() => onUnpublish(video.id)}
                  >
                    Unpublish
                  </button>
                )}
                <button
                  type="button"
                  className="admin-btn-danger"
                  disabled={actionId === video.id}
                  onClick={() => onDelete(video.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
