import { Navigate, Outlet } from 'react-router-dom';

export default function AdminRoute() {
  const token = localStorage.getItem('accessToken');
  const userJson = localStorage.getItem('user');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (userJson) {
    try {
      const user = JSON.parse(userJson) as { role?: string };
      if (user.role === 'ADMIN') {
        return <Outlet />;
      }
    } catch {
      /* invalid stored user */
    }
  }

  return <Navigate to="/" replace />;
}
