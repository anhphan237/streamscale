import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import AdminRoute from '../components/AdminRoute';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminVideoCreatePage from '../pages/AdminVideoCreatePage';
import AdminVideoListPage from '../pages/AdminVideoListPage';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import ProfileSelectionPage from '../pages/ProfileSelectionPage';
import RegisterPage from '../pages/RegisterPage';
import VideoDetailPage from '../pages/VideoDetailPage';

function ProfileRequiredRoute() {
  const profileId = localStorage.getItem('selectedProfileId');
  if (!profileId) {
    return <Navigate to="/profiles" replace />;
  }
  return <Outlet />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profiles" element={<ProfileSelectionPage />} />
          <Route element={<ProfileRequiredRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/videos/:id" element={<VideoDetailPage />} />
          </Route>
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin/videos" element={<AdminVideoListPage />} />
          <Route path="/admin/videos/new" element={<AdminVideoCreatePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
