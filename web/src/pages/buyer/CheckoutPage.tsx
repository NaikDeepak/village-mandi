import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { batchesApi, ordersApi } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import type { Batch, CreateOrderInput } from '@/types';
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  MapPin,
  ShoppingCart,
  Truck,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const { items: cartItems, clearCart, getTotalAmount } = useCartStore();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentBatch, setCurrentBatch] = useState<Batch | null>(null);
  const [fulfillmentType, setFulfillmentType] = useState<'PICKUP' | 'DELIVERY'>('PICKUP');

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        const res = await batchesApi.getCurrent();
        if (res.data?.batch) {
          setCurrentBatch(res.data.batch);
        }
      } catch (error) {
        console.error('Failed to fetch batch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBatch();
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (!loading && cartItems.length === 0) {
      navigate('/shop');
    }
  }, [cartItems.length, loading, navigate]);

  const handlePlaceOrder = async () => {
    if (!currentBatch) return;

    setSubmitting(true);
    try {
      const orderData: CreateOrderInput = {
        batchId: currentBatch.id,
        fulfillmentType,
        items: cartItems.map((item) => ({
          batchProductId: item.batchProductId,
          orderedQty: item.quantity,
        })),
      };

      const res = await ordersApi.create(orderData);
      if (res.data) {
        toast({
          title: 'Order Placed Successfully!',
          description: 'Your fresh produce order has been recorded.',
        });
        const orderId = res.data.order.id;
        clearCart();
        navigate(`/shop/order-success?id=${orderId}`);
      } else {
        toast({
          title: res.error || 'Failed to place order',
          description: res.message || 'Something went wrong',
          variant: 'destructive',
        });
      }
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'Failed to place order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-mandi-cream">
        <Loader2 className="h-10 w-10 animate-spin text-mandi-green mb-4" />
        <p className="text-mandi-dark font-medium">Preparing checkout...</p>
      </div>
    );
  }

  const subtotal = getTotalAmount();
  const deliveryFee = 0; // Mock delivery fee for now
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-mandi-cream pb-12">
      <header className="bg-white border-b border-mandi-muted/20 shadow-sm sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/shop')} className="gap-1">
            <ChevronLeft className="h-4 w-4" /> Back to Shop
          </Button>
          <h1 className="text-lg font-bold text-mandi-dark">Checkout</h1>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Fulfillment Section */}
            <section className="bg-white rounded-xl shadow-sm border border-mandi-muted/10 p-6">
              <h2 className="text-lg font-bold text-mandi-dark mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5 text-mandi-green" /> Fulfillment Method
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFulfillmentType('PICKUP')}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    fulfillmentType === 'PICKUP'
                      ? 'border-mandi-green bg-mandi-green/5'
                      : 'border-mandi-muted/10 hover:border-mandi-muted/30'
                  }`}
                >
                  <MapPin
                    className={`h-6 w-6 mb-2 ${fulfillmentType === 'PICKUP' ? 'text-mandi-green' : 'text-mandi-muted'}`}
                  />
                  <p className="font-bold text-mandi-dark">Self Pickup</p>
                  <p className="text-xs text-mandi-muted mt-1">Collect from hub on delivery date</p>
                </button>
                <button
                  type="button"
                  onClick={() => setFulfillmentType('DELIVERY')}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    fulfillmentType === 'DELIVERY'
                      ? 'border-mandi-green bg-mandi-green/5'
                      : 'border-mandi-muted/10 hover:border-mandi-muted/30'
                  }`}
                >
                  <Truck
                    className={`h-6 w-6 mb-2 ${fulfillmentType === 'DELIVERY' ? 'text-mandi-green' : 'text-mandi-muted'}`}
                  />
                  <p className="font-bold text-mandi-dark">Home Delivery</p>
                  <p className="text-xs text-mandi-muted mt-1">
                    Delivered to your registered address
                  </p>
                </button>
              </div>

              {fulfillmentType === 'PICKUP' && currentBatch?.hub && (
                <div className="mt-4 p-3 bg-mandi-cream/30 rounded-lg border border-mandi-earth/10 flex gap-3">
                  <MapPin className="h-5 w-5 text-mandi-earth flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-mandi-dark">Pickup Location:</p>
                    <p className="text-xs text-mandi-muted">{currentBatch.hub.name}</p>
                    <p className="text-[10px] text-mandi-muted">{currentBatch.hub.address}</p>
                  </div>
                </div>
              )}

              {fulfillmentType === 'DELIVERY' && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 flex gap-3">
                  <Truck className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-blue-900">Delivery Address:</p>
                    <p className="text-xs text-blue-800">{user?.name}</p>
                    <p className="text-[10px] text-blue-700">
                      Will be delivered to the location on file for your phone: {user?.phone}
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* Order Items Section */}
            <section className="bg-white rounded-xl shadow-sm border border-mandi-muted/10 p-6">
              <h2 className="text-lg font-bold text-mandi-dark mb-4 flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-mandi-green" /> Order Items
              </h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.batchProductId}
                    className="flex justify-between items-center py-2 border-b border-mandi-muted/5 last:border-0"
                  >
                    <div>
                      <h4 className="font-medium text-sm text-mandi-dark">{item.name}</h4>
                      <p className="text-[10px] text-mandi-muted">
                        {item.quantity} {item.unit} x ₹
                        {(item.pricePerUnit * (1 + item.facilitationPercent / 100)).toFixed(2)}
                      </p>
                    </div>
                    <p className="font-bold text-sm text-mandi-dark">
                      ₹
                      {(
                        item.pricePerUnit *
                        (1 + item.facilitationPercent / 100) *
                        item.quantity
                      ).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar / Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-mandi-muted/10 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-mandi-dark mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-mandi-muted">Subtotal</span>
                  <span className="text-mandi-dark font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-mandi-muted">Delivery Fee</span>
                  <span className="text-mandi-dark font-medium">
                    {deliveryFee === 0 ? (
                      <Badge
                        variant="outline"
                        className="text-[10px] text-mandi-green border-mandi-green"
                      >
                        FREE
                      </Badge>
                    ) : (
                      `₹${(deliveryFee as number).toFixed(2)}`
                    )}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="font-bold text-mandi-dark">Total</span>
                  <span className="text-2xl font-bold text-mandi-green">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-mandi-cream/20 rounded-lg p-3 mb-6">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-mandi-green mt-0.5" />
                  <p className="text-[10px] text-mandi-muted leading-tight">
                    By placing this order, you commit to purchasing these items. Payment will be
                    collected as per the Virtual Mandi rules.
                  </p>
                </div>
              </div>

              <Button
                className="w-full h-14 text-lg font-bold gap-2"
                disabled={submitting || cartItems.length === 0}
                onClick={handlePlaceOrder}
              >
                {submitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Place Order <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>

              <p className="text-[10px] text-center text-mandi-muted mt-4 italic">
                Expected Delivery:{' '}
                {currentBatch
                  ? new Date(currentBatch.deliveryDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                    })
                  : '...'}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
