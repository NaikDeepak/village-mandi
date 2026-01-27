import { Button } from '@/components/ui/button';
import { brand } from '@/config/brand';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export function WaitlistPage() {
  return (
    <div className="min-h-screen bg-mandi-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-mandi-green/10 rounded-full">
              <Clock className="w-12 h-12 text-mandi-green" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-mandi-dark mb-2">Registration Received!</h1>
          <p className="text-mandi-muted mb-6">
            Thank you for your interest in {brand.name}. Your account is currently pending approval
            by our administrators.
          </p>

          <div className="bg-mandi-cream p-4 rounded-md mb-8 text-left">
            <h3 className="text-sm font-semibold text-mandi-dark mb-1">What's next?</h3>
            <p className="text-xs text-mandi-muted">
              We review applications manually to ensure the best experience for our community.
              Please check back in 24-48 hours. You will be able to access the shop once approved.
            </p>
          </div>

          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/buyer-login">Check Status</Link>
            </Button>
            <Link to="/" className="text-sm text-mandi-muted hover:text-mandi-green block">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
