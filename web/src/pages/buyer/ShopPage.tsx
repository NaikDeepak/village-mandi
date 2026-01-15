import { CartDrawer } from '@/components/shop/CartDrawer';
import { ProductCard } from '@/components/shop/ProductCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { batchProductsApi, batchesApi } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import type { Batch, BatchProduct } from '@/types';
import {
  AlertCircle,
  ArrowRight,
  ChevronLeft,
  Loader2,
  MapPin,
  ShoppingCart,
  Truck,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function ShopPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [currentBatch, setCurrentBatch] = useState<Batch | null>(null);
  const [products, setProducts] = useState<BatchProduct[]>([]);
  const [fulfillmentType, setFulfillmentType] = useState<'PICKUP' | 'DELIVERY'>('PICKUP');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const {
    items: cartItems,
    addItem,
    updateQuantity,
    getTotalAmount,
    getTotalItems,
  } = useCartStore();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const batchRes = await batchesApi.getCurrent();
        if (batchRes.data?.batch) {
          setCurrentBatch(batchRes.data.batch);
          const productsRes = await batchProductsApi.getByBatch(batchRes.data.batch.id, true);
          if (productsRes.data) {
            setProducts(productsRes.data.products);
          }
        }
      } catch (error) {
        console.error('Failed to fetch shop data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load products. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleUpdateQuantity = (bp: BatchProduct, qty: number) => {
    const existing = cartItems.find((i) => i.batchProductId === bp.id);
    if (qty <= 0) {
      updateQuantity(bp.id, 0);
    } else if (!existing) {
      addItem(
        {
          batchProductId: bp.id,
          productId: bp.productId,
          name: bp.product.name,
          unit: bp.product.unit,
          pricePerUnit: bp.pricePerUnit,
          facilitationPercent: bp.facilitationPercent,
          farmerName: bp.product.farmer?.name,
        },
        qty
      );
    } else {
      updateQuantity(bp.id, qty);
    }
  };

  const isCartValid = () => {
    if (cartItems.length === 0) return false;

    return cartItems.every((item) => {
      const product = products.find((p) => p.id === item.batchProductId);
      if (!product) return false;
      return (
        item.quantity >= product.minOrderQty &&
        (!product.maxOrderQty || item.quantity <= product.maxOrderQty)
      );
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-mandi-cream">
        <Loader2 className="h-10 w-10 animate-spin text-mandi-green mb-4" />
        <p className="text-mandi-dark font-medium">Loading products...</p>
      </div>
    );
  }

  if (!currentBatch) {
    return (
      <div className="min-h-screen bg-mandi-cream flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="h-16 w-16 text-mandi-earth mb-4" />
        <h2 className="text-2xl font-bold text-mandi-dark mb-2">No Active Batch</h2>
        <p className="text-mandi-muted max-w-md">
          There are currently no open batches for ordering. Please check back later or contact your
          hub coordinator.
        </p>
        <Button onClick={() => navigate('/shop')} className="mt-6" variant="outline">
          <ChevronLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  const cartTotal = getTotalAmount();
  const cartItemsCount = getTotalItems();

  // Group products by farmer
  const productsByFarmer = products.reduce(
    (acc, bp) => {
      const farmerName = bp.product.farmer?.name || 'Unknown Farmer';
      if (!acc[farmerName]) {
        acc[farmerName] = [];
      }
      acc[farmerName].push(bp);
      return acc;
    },
    {} as Record<string, BatchProduct[]>
  );

  return (
    <div className="min-h-screen bg-mandi-cream pb-24 md:pb-8">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-mandi-muted/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/shop')}
                className="md:hidden"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-lg font-bold text-mandi-dark leading-tight">Virtual Mandi</h1>
                <p className="text-[10px] text-mandi-muted uppercase tracking-wider font-semibold">
                  Hub: {currentBatch.hub?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-medium text-mandi-dark">{user?.name}</p>
                <p className="text-[10px] text-mandi-muted">{user?.phone}</p>
              </div>
              <button
                type="button"
                className="relative cursor-pointer"
                onClick={() => setIsCartOpen(true)}
                aria-label="Open cart"
              >
                <ShoppingCart className="h-6 w-6 text-mandi-dark" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-mandi-green text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Batch Info Hero */}
        <div className="bg-white rounded-xl shadow-sm border border-mandi-muted/10 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-mandi-green/10 text-mandi-green border-mandi-green/20 hover:bg-mandi-green/10">
                  OPEN FOR ORDERS
                </Badge>
                <span className="text-xs text-mandi-muted">
                  Cutoff: {new Date(currentBatch.cutoffAt).toLocaleDateString()}{' '}
                  {new Date(currentBatch.cutoffAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-mandi-dark">{currentBatch.name}</h2>
              <p className="text-mandi-muted text-sm mt-1">
                Estimated Delivery:{' '}
                <span className="font-semibold text-mandi-dark">
                  {new Date(currentBatch.deliveryDate).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-mandi-cream rounded-lg flex items-center gap-3">
                <MapPin className="h-5 w-5 text-mandi-earth" />
                <div>
                  <p className="text-[10px] uppercase text-mandi-muted font-bold">Pickup Point</p>
                  <p className="text-xs font-medium text-mandi-dark">{currentBatch.hub?.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid Grouped by Farmer */}
        <div className="space-y-12">
          {Object.entries(productsByFarmer).map(([farmerName, farmerProducts]) => (
            <div key={farmerName}>
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-xl font-bold text-mandi-dark whitespace-nowrap">
                  {farmerName}'s Produce
                </h3>
                <div className="h-px bg-mandi-muted/20 flex-grow" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {farmerProducts.map((bp) => (
                  <ProductCard
                    key={bp.id}
                    batchProduct={bp}
                    quantity={cartItems.find((i) => i.batchProductId === bp.id)?.quantity || 0}
                    onQuantityChange={(qty) => handleUpdateQuantity(bp, qty)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center border border-dashed border-mandi-muted/30">
            <p className="text-mandi-muted">No products available in this batch yet.</p>
          </div>
        )}
      </main>

      {/* Floating Cart / Checkout Bar (Mobile & Desktop Sidebar) */}
      {cartItemsCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-mandi-muted/20 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] p-4 z-40">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 w-full md:w-auto overflow-x-auto py-1">
              <div className="flex-shrink-0">
                <p className="text-[10px] uppercase text-mandi-muted font-bold">Estimated Total</p>
                <p className="text-xl font-bold text-mandi-green">₹{cartTotal.toFixed(2)}</p>
              </div>
              <Separator orientation="vertical" className="h-8 hidden md:block" />
              <div className="flex items-center gap-2 bg-mandi-cream p-1 rounded-lg">
                <Button
                  variant={fulfillmentType === 'PICKUP' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-8 text-xs gap-1"
                  onClick={() => setFulfillmentType('PICKUP')}
                >
                  <MapPin className="h-3 w-3" /> Pickup
                </Button>
                <Button
                  variant={fulfillmentType === 'DELIVERY' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-8 text-xs gap-1"
                  onClick={() => setFulfillmentType('DELIVERY')}
                >
                  <Truck className="h-3 w-3" /> Delivery
                </Button>
              </div>
            </div>

            <Button
              className="w-full md:w-64 h-12 text-lg font-bold gap-2"
              disabled={!isCartValid()}
              onClick={() => navigate('/shop/checkout')}
            >
              Checkout <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
          {!isCartValid() && (
            <p className="text-center text-[10px] text-red-500 font-medium mt-2">
              Some items in your cart do not meet the minimum order quantity.
            </p>
          )}
        </div>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
