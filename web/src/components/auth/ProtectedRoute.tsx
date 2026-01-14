import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore, UserRole } from '@/stores/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mandi-cream">
        <div className="text-mandi-muted">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to appropriate login page based on the route being accessed
    const isAdminRoute = location.pathname.startsWith('/admin');
    const loginPath = isAdminRoute ? '/login' : '/buyer-login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const dashboardPath = user.role === 'ADMIN' ? '/admin' : '/shop';
    return <Navigate to={dashboardPath} replace />;
  }

  return <>{children}</>;
}
