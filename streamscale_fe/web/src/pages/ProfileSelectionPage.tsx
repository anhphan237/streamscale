import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileApi } from '../api/profileApi';
import type { Profile } from '../types/profile';

export default function ProfileSelectionPage() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  const loadProfiles = () =>
    profileApi
      .getMyProfiles()
      .then((res) => setProfiles(res.data))
      .catch(() => setError('Could not load profiles'));

  useEffect(() => {
    loadProfiles().finally(() => setLoading(false));
  }, []);

  const selectProfile = (profile: Profile) => {
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
      setError('Could not create profile');
    } finally {
      setCreating(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('selectedProfileId');
    navigate('/login');
  };

  if (loading) return <main className="profile-page">Loading…</main>;

  return (
    <main className="profile-page">
      <h1>Who&apos;s watching?</h1>
      {error && <p className="auth-page__error">{error}</p>}
      <div className="profile-page__grid">
        {profiles.map((profile) => (
          <button
            key={profile.id}
            type="button"
            className="profile-page__card"
            onClick={() => selectProfile(profile)}
          >
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" />
            ) : (
              <span className="profile-page__avatar">{profile.name[0]}</span>
            )}
            <span>{profile.name}</span>
          </button>
        ))}
      </div>
      <div className="profile-page__create">
        <form onSubmit={handleCreate}>
          <label>
            Add profile
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Profile name"
              required
            />
          </label>
          <button type="submit" disabled={creating}>
            {creating ? 'Adding…' : 'Add profile'}
          </button>
        </form>
      </div>
      <p>
        <button type="button" onClick={logout}>
          Sign out
        </button>
      </p>
    </main>
  );
}
