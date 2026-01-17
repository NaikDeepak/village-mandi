import { PhoneLoginForm } from '@/components/auth/PhoneLoginForm';
import { brand } from '@/config/brand';
import { useAuthStore } from '@/stores/auth';
import { Link, Navigate } from 'react-router-dom';

export function BuyerLoginPage() {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  // Redirect if already authenticated
  if (!isLoading && isAuthenticated) {
    const dashboardPath = user?.role === 'ADMIN' ? '/admin' : '/buyer-dashboard';
    return <Navigate to={dashboardPath} replace />;
  }

  return (
    <div className="min-h-screen bg-mandi-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-mandi-dark">{brand.name}</h1>
            <p className="text-mandi-muted mt-2">Buyer Login</p>
          </div>

          <PhoneLoginForm />

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-mandi-muted">
              Only invited buyers can login. Contact admin for access.
            </p>
            <Link to="/" className="text-sm text-mandi-muted hover:text-mandi-green block">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
