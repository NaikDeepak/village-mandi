import { Button } from '@/components/ui/button';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import { Link, Outlet, useNavigate } from 'react-router-dom';

export function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await authApi.logout();
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-mandi-cream">
      <header className="bg-white border-b border-mandi-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link
                to="/admin"
                className="text-xl font-bold text-mandi-dark flex items-center gap-2"
              >
                Virtual Mandi
                <span className="text-xs bg-mandi-green/10 text-mandi-green px-2 py-0.5 rounded font-normal">
                  Admin
                </span>
              </Link>

              <nav className="hidden md:flex gap-4">
                <Link
                  to="/admin"
                  className="text-sm font-medium text-gray-700 hover:text-mandi-green"
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/farmers"
                  className="text-sm font-medium text-gray-700 hover:text-mandi-green"
                >
                  Farmers
                </Link>
                <Link
                  to="/admin/products"
                  className="text-sm font-medium text-gray-700 hover:text-mandi-green"
                >
                  Products
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-mandi-muted">{user?.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
