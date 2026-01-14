import { Button } from '@/components/ui/button';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import { useNavigate } from 'react-router-dom';

export function AdminDashboardPage() {
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
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-mandi-dark">Virtual Mandi</h1>
              <span className="text-sm bg-mandi-green/10 text-mandi-green px-2 py-1 rounded">
                Admin
              </span>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-mandi-dark mb-4">Dashboard</h2>
          <p className="text-mandi-muted">
            Welcome to the Virtual Mandi admin panel. This is a placeholder page.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-mandi-cream rounded-lg p-6">
              <h3 className="font-semibold text-mandi-dark">Batches</h3>
              <p className="text-3xl font-bold text-mandi-green mt-2">5</p>
              <p className="text-sm text-mandi-muted mt-1">Total batches</p>
            </div>
            <div className="bg-mandi-cream rounded-lg p-6">
              <h3 className="font-semibold text-mandi-dark">Orders</h3>
              <p className="text-3xl font-bold text-mandi-green mt-2">2</p>
              <p className="text-sm text-mandi-muted mt-1">Active orders</p>
            </div>
            <div className="bg-mandi-cream rounded-lg p-6">
              <h3 className="font-semibold text-mandi-dark">Farmers</h3>
              <p className="text-3xl font-bold text-mandi-green mt-2">5</p>
              <p className="text-sm text-mandi-muted mt-1">Registered farmers</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
