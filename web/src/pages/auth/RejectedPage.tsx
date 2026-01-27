import { Button } from '@/components/ui/button';
import { brand } from '@/config/brand';
import { XCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function RejectedPage() {
  const location = useLocation();
  const reason = location.state?.reason || 'Your application was not approved at this time.';

  return (
    <div className="min-h-screen bg-mandi-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-red-100 rounded-full">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-mandi-dark mb-2">Application Status</h1>
          <p className="text-mandi-muted mb-6">
            We regret to inform you that your registration for {brand.name} has been rejected.
          </p>

          <div className="bg-red-50 border border-red-100 p-4 rounded-md mb-8 text-left">
            <h3 className="text-sm font-semibold text-red-800 mb-1">Reason:</h3>
            <p className="text-sm text-red-700">{reason}</p>
          </div>

          <p className="text-xs text-mandi-muted mb-6">
            If you believe this is an error, please contact us at {brand.email}
          </p>

          <div className="space-y-4">
            <Button asChild variant="outline" className="w-full">
              <Link to="/">Back to Home</Link>
            </Button>
            <Link
              to="/buyer-login"
              className="text-sm text-mandi-muted hover:text-mandi-green block"
            >
              Try a different number
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
