import { Link, useNavigate } from 'react-router-dom';

export default function AppHeader() {
  const navigate = useNavigate();
  let role = '';
  try {
    const user = JSON.parse(localStorage.getItem('user') ?? '{}') as {
      role?: string;
    };
    role = user.role ?? '';
  } catch {
    /* ignore */
  }

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('selectedProfileId');
    navigate('/login');
  };

  return (
    <header className="app-header">
      <Link to="/" className="app-header__brand">
        StreamScale
      </Link>
      <div className="app-header__actions">
        <Link to="/profiles">Profiles</Link>
        {role === 'ADMIN' && <Link to="/admin/videos/new">Admin</Link>}
        <button type="button" onClick={logout}>
          Sign out
        </button>
      </div>
    </header>
  );
}
