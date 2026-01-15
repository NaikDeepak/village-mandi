import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, CheckCircle2, Home, ShoppingBag } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function OrderSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');

  return (
    <div className="min-h-screen bg-mandi-cream flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center shadow-lg border-mandi-muted/10">
        <div className="flex justify-center mb-6">
          <div className="bg-mandi-green/10 p-4 rounded-full">
            <CheckCircle2 className="h-16 w-16 text-mandi-green" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-mandi-dark mb-2">Order Placed!</h1>
        <p className="text-mandi-muted mb-6">
          Thank you for your order. Your fresh produce has been reserved from the Mandi.
        </p>

        {orderId && (
          <div className="bg-mandi-cream/30 rounded-lg p-3 mb-8 border border-mandi-earth/5">
            <p className="text-[10px] uppercase text-mandi-muted font-bold mb-1">Order Reference</p>
            <p className="text-sm font-mono font-bold text-mandi-dark">#{orderId}</p>
          </div>
        )}

        <div className="space-y-3">
          <Button
            className="w-full h-12 text-md font-bold gap-2"
            onClick={() => navigate('/buyer-dashboard')}
          >
            <ShoppingBag className="h-5 w-5" /> View Order Status
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-12 text-sm font-semibold gap-2"
              onClick={() => navigate('/shop')}
            >
              <ArrowRight className="h-4 w-4" /> Keep Shopping
            </Button>
            <Button
              variant="ghost"
              className="h-12 text-sm font-semibold gap-2"
              onClick={() => navigate('/buyer-dashboard')}
            >
              <Home className="h-4 w-4" /> Dashboard
            </Button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-mandi-muted/10">
          <p className="text-xs text-mandi-muted">
            You will receive updates on your order status as the batch progresses. Check the{' '}
            <button
              type="button"
              className="font-bold text-mandi-earth hover:underline"
              onClick={() => navigate('/rules')}
            >
              Mandi Rules
            </button>{' '}
            for payment and collection details.
          </p>
        </div>
      </Card>
    </div>
  );
}
