import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import type { UserRole } from '../types/domain';

export const ProtectedRoute = ({ roles }: { roles?: UserRole[] }) => {
  const profile = useAuthStore((s) => s.profile);
  if (!profile) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(profile.role)) return <Navigate to="/" replace />;
  return <Outlet />;
};
