import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth';
import { authApi } from '@/lib/api';

export function BuyerDashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await authApi.logout();
    logout();
    navigate('/buyer-login');
  };

  return (
    <div className="min-h-screen bg-mandi-cream">
      <header className="bg-white border-b border-mandi-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-mandi-dark">Virtual Mandi</h1>
              <span className="text-sm bg-mandi-earth/10 text-mandi-earth px-2 py-1 rounded">
                Buyer
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-mandi-muted">
                {user?.name}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-mandi-dark mb-4">Welcome, {user?.name}!</h2>
          <p className="text-mandi-muted">
            This is your buyer dashboard. Browse the current batch and place your orders.
          </p>

          <div className="mt-8 p-6 bg-mandi-cream rounded-lg text-center">
            <h3 className="font-semibold text-mandi-dark mb-2">Current Batch</h3>
            <p className="text-mandi-muted text-sm mb-4">
              Week 3 - January 2025
            </p>
            <Button>
              Browse Products
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
