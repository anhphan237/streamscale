import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileApi } from '../api/profileApi';
import type { Profile, ProfileRequest } from '../types/profile';

const emptyEdit: ProfileRequest = {
  name: '',
  avatarUrl: '',
  isKids: false,
};

export default function ProfileSelectionPage() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [managing, setManaging] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<ProfileRequest>(emptyEdit);
  const [saving, setSaving] = useState(false);

  const loadProfiles = () =>
    profileApi
      .getMyProfiles()
      .then((res) => setProfiles(res.data))
      .catch(() => setError('Không tải được profiles'));

  useEffect(() => {
    loadProfiles().finally(() => setLoading(false));
  }, []);

  const selectProfile = (profile: Profile) => {
    if (managing) return;
    localStorage.setItem('selectedProfileId', String(profile.id));
    navigate('/');
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    setError('');
    try {
      await profileApi.create({ name: newName.trim(), isKids: false });
      setNewName('');
      await loadProfiles();
    } catch {
      setError('Không tạo được profile');
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (profile: Profile) => {
    setEditingId(profile.id);
    setEditForm({
      name: profile.name,
      avatarUrl: profile.avatarUrl ?? '',
      isKids: profile.isKids,
    });
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (editingId == null) return;
    setSaving(true);
    setError('');
    try {
      await profileApi.update(editingId, {
        name: editForm.name.trim(),
        avatarUrl: editForm.avatarUrl || undefined,
        isKids: editForm.isKids,
      });
      setEditingId(null);
      await loadProfiles();
    } catch {
      setError('Không cập nhật được profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (profile: Profile) => {
    if (!window.confirm(`Xóa profile "${profile.name}"?`)) return;
    setError('');
    try {
      await profileApi.delete(profile.id);
      if (localStorage.getItem('selectedProfileId') === String(profile.id)) {
        localStorage.removeItem('selectedProfileId');
      }
      await loadProfiles();
    } catch {
      setError('Không xóa được profile');
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('selectedProfileId');
    navigate('/login');
  };

  if (loading) return <main className="profile-page">Đang tải…</main>;

  return (
    <main className="profile-page">
      <h1>{managing ? 'Quản lý profiles' : 'Ai đang xem?'}</h1>
      <p className="profile-page__hint">
        {managing
          ? 'Sửa hoặc xóa profile. Bấm Done để quay lại chọn profile.'
          : 'Chọn profile để vào StreamScale.'}
      </p>

      {error && <p className="auth-page__error">{error}</p>}

      <button
        type="button"
        className="profile-page__manage-toggle"
        onClick={() => {
          setManaging((m) => !m);
          setEditingId(null);
        }}
      >
        {managing ? 'Done' : 'Manage Profiles'}
      </button>

      <div className="profile-page__grid">
        {profiles.map((profile) => (
          <div key={profile.id} className="profile-page__item">
            <button
              type="button"
              className="profile-page__card"
              onClick={() => selectProfile(profile)}
              disabled={managing}
            >
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="" />
              ) : (
                <span className="profile-page__avatar">{profile.name[0]}</span>
              )}
              <span>{profile.name}</span>
              {profile.isKids && (
                <span className="profile-page__badge">Kids</span>
              )}
            </button>
            {managing && (
              <div className="profile-page__item-actions">
                <button type="button" onClick={() => startEdit(profile)}>
                  Sửa
                </button>
                <button
                  type="button"
                  className="profile-page__delete"
                  onClick={() => handleDelete(profile)}
                >
                  Xóa
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {managing && editingId != null && (
        <div className="profile-page__edit panel">
          <h2>Sửa profile</h2>
          <form onSubmit={handleUpdate}>
            <label>
              Tên
              <input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                required
              />
            </label>
            <label>
              Avatar URL
              <input
                value={editForm.avatarUrl ?? ''}
                onChange={(e) =>
                  setEditForm({ ...editForm, avatarUrl: e.target.value })
                }
                placeholder="https://..."
              />
            </label>
            <label className="profile-page__checkbox">
              <input
                type="checkbox"
                checked={editForm.isKids}
                onChange={(e) =>
                  setEditForm({ ...editForm, isKids: e.target.checked })
                }
              />
              Kids profile
            </label>
            <div className="profile-page__form-actions">
              <button type="submit" disabled={saving}>
                {saving ? 'Đang lưu…' : 'Lưu'}
              </button>
              <button
                type="button"
                className="profile-page__cancel"
                onClick={() => setEditingId(null)}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {!managing && (
        <div className="profile-page__create">
          <form onSubmit={handleCreate}>
            <label>
              Thêm profile
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Tên profile"
                required
              />
            </label>
            <button type="submit" disabled={creating}>
              {creating ? 'Đang thêm…' : 'Thêm profile'}
            </button>
          </form>
        </div>
      )}

      <p>
        <button type="button" onClick={logout}>
          Đăng xuất
        </button>
      </p>
    </main>
  );
}
