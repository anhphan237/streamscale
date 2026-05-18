import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileApi } from '../api/profileApi';
import type { Profile } from '../types/profile';

export default function ProfileSelectionPage() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    profileApi
      .getMyProfiles()
      .then((res) => setProfiles(res.data))
      .catch(() => setError('Could not load profiles'))
      .finally(() => setLoading(false));
  }, []);

  const selectProfile = (profile: Profile) => {
    localStorage.setItem('selectedProfileId', String(profile.id));
    navigate('/');
  };

  if (loading) return <main className="profile-page">Loading…</main>;
  if (error) return <main className="profile-page">{error}</main>;

  return (
    <main className="profile-page">
      <h1>Who&apos;s watching?</h1>
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
    </main>
  );
}
