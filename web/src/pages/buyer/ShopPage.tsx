import { Navbar } from '@/components/layout/Navbar';
import { CartDrawer } from '@/components/shop/CartDrawer';
import { FarmerTrustHeader } from '@/components/shop/FarmerTrustHeader';
import { ProductCard } from '@/components/shop/ProductCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { brand } from '@/config/brand';
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
import { useNavigate, useSearchParams } from 'react-router-dom';

export function ShopPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuthStore();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [availableBatches, setAvailableBatches] = useState<Batch[]>([]);
  const [currentBatch, setCurrentBatch] = useState<Batch | null>(null);
  const [products, setProducts] = useState<BatchProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [fulfillmentType, setFulfillmentType] = useState<'PICKUP' | 'DELIVERY'>('PICKUP');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const {
    items: cartItems,
    addItem,
    updateQuantity,
    getTotalAmount,
    getTotalItems,
    clearCart,
  } = useCartStore();

  // 1. Fetch available batches on mount
  // biome-ignore lint/correctness/useExhaustiveDependencies: Fetch only once on mount
  useEffect(() => {
    const fetchBatches = async () => {
      setLoading(true);
      try {
        const res = await batchesApi.getOpen();
        if (res.data?.batches) {
          const batches = res.data.batches;
          setAvailableBatches(batches);
        }
      } catch (error) {
        console.error('Failed to fetch batches:', error);
        toast({
          title: 'Error',
          description: 'Failed to load active batches.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // 2. Sync selection with URL or default
  useEffect(() => {
    if (availableBatches.length === 0) return;

    const batchIdParam = searchParams.get('batchId');
    if (batchIdParam) {
      const target = availableBatches.find((b) => b.id === batchIdParam);
      if (target && target.id !== currentBatch?.id) {
        setCurrentBatch(target);
      }
    } else if (!currentBatch) {
      // Default to first (newest) if no selection
      const defaultBatch = availableBatches[0];
      setCurrentBatch(defaultBatch);
      // Sync URL
      setSearchParams({ batchId: defaultBatch.id }, { replace: true });
    }
  }, [availableBatches, searchParams, currentBatch, setSearchParams]);

  // 3. Fetch products when currentBatch changes
  useEffect(() => {
    const fetchProducts = async () => {
      if (!currentBatch) return;

      setLoadingProducts(true);
      try {
        const res = await batchProductsApi.getByBatch(currentBatch.id, true);
        if (res.data) {
          setProducts(res.data.products);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        toast({
          title: 'Error',
          description: 'Failed to load products for this batch.',
          variant: 'destructive',
        });
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [currentBatch, toast]);

  const handleBatchChange = (batchId: string) => {
    const newBatch = availableBatches.find((b) => b.id === batchId);
    if (!newBatch) return;

    // Warn if cart has items from another batch?
    // Current cart store implementation might separate by batchId?
    // Assuming simple cart for now, clearing it might be safer or warning user.
    // For now, let's just switch. The backend will validate mix-match batch items
    // (createOrder requires single batchId).
    // Ideally, we should check if cart has items from a different batch.

    // Quick check: if we have items, and they belong to another batch (if we stored batchId in cart item),
    // we should warn. For this MVP, we will implicitly support it or let the user manage it.
    // Better UX: Changing batch implicitly starts a fresh context.
    // Let's prompt or just switch. For simplicity/speed: just switch.

    // Check if cart has items (assuming cart items don't strictly link to batchId in store,
    // but they come from batchProducts which are unique per batch).
    // If I switch batch, the product IDs will differ. Existing cart items will persist visually
    // but won't match any product in the new list.
    // It is SAFER to clear cart or warn user. Let's Warn & Clear for safety to avoid cross-batch order errors.

    if (cartItems.length > 0) {
      const confirmChange = window.confirm(
        'Switching batches will clear your current cart. Do you want to proceed?'
      );
      if (!confirmChange) return;
      clearCart();
    }

    setCurrentBatch(newBatch);
    setSearchParams({ batchId: newBatch.id });
  };

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
      // Find product in CURRENT loaded products list.
      // If product is from another batch, it won't be found here -> treating as invalid/blocking checkout is good.
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
        <p className="text-mandi-dark font-medium">Loading upcoming batches...</p>
      </div>
    );
  }

  if (!currentBatch || availableBatches.length === 0) {
    return (
      <div className="min-h-screen bg-mandi-cream flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="h-16 w-16 text-mandi-earth mb-4" />
        <h2 className="text-2xl font-bold text-mandi-dark mb-2">No Active Batches</h2>
        <p className="text-mandi-muted max-w-md">
          There are currently no open batches for ordering. Please check back later or contact your
          hub coordinator.
        </p>
        <Button onClick={() => navigate('/buyer-dashboard')} className="mt-6" variant="outline">
          <ChevronLeft className="mr-2 h-4 w-4" /> Go to Dashboard
        </Button>
      </div>
    );
  }

  const cartTotal = getTotalAmount();
  const cartItemsCount = getTotalItems();

  // Group products by farmer
  const productsByFarmer = products.reduce(
    (acc, bp) => {
      const farmerId = bp.product.farmer?.id || 'unknown';
      if (!acc[farmerId]) {
        acc[farmerId] = {
          farmer: {
            id: farmerId,
            name: bp.product.farmer?.name || 'Unknown Farmer',
            location: bp.product.farmer?.location || 'Unknown Location',
            description: bp.product.farmer?.description,
            relationshipLevel: bp.product.farmer?.relationshipLevel,
          },
          products: [],
        };
      }
      acc[farmerId].products.push(bp);
      return acc;
    },
    {} as Record<
      string,
      {
        farmer: {
          id: string;
          name: string;
          location: string;
          description?: string | null;
          relationshipLevel?: 'SELF' | 'FAMILY' | 'FRIEND' | 'REFERRED';
        };
        products: BatchProduct[];
      }
    >
  );

  return (
    <>
      <Navbar variant="internal" />
      <div className="min-h-screen bg-mandi-cream pb-40 pt-24">
        {/* Shop Header */}
        <header className="sticky top-20 z-30 bg-white border-b border-mandi-muted/20 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/buyer-dashboard')}
                  className="md:hidden"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div>
                  {/* Batch Selector / Display (Pills) */}
                  {availableBatches.length > 1 ? (
                    <div>
                      <p className="text-[10px] text-mandi-muted font-bold uppercase tracking-wider mb-1 ml-0.5">
                        Select Delivery Date:
                      </p>
                      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide max-w-[220px] sm:max-w-md pb-1">
                        {availableBatches.map((b) => {
                          const isSelected = currentBatch?.id === b.id;
                          const dateStr = new Date(b.deliveryDate).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                          });
                          return (
                            <button
                              type="button"
                              key={b.id}
                              onClick={() => handleBatchChange(b.id)}
                              className={`flex flex-col flex-shrink-0 px-3 py-1 rounded-md border items-center justify-center transition-all ${
                                isSelected
                                  ? 'bg-mandi-green text-white border-mandi-green shadow-sm'
                                  : 'bg-white text-mandi-dark border-mandi-dark/10 hover:border-mandi-green/50 hover:bg-mandi-green/5'
                              }`}
                            >
                              <span className="text-[10px] font-bold uppercase tracking-wider leading-none">
                                {dateStr}
                              </span>
                              <span
                                className={`text-[8px] leading-none mt-0.5 ${isSelected ? 'text-white/90' : 'text-mandi-muted'}`}
                              >
                                {b.hub?.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <h1 className="text-lg font-bold text-mandi-dark leading-tight sm:hidden">
                        {brand.name}
                      </h1>
                      <p className="text-[10px] text-mandi-muted uppercase tracking-wider font-semibold">
                        Hub: {currentBatch?.hub?.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-medium text-mandi-dark">{user?.name}</p>
                  <p className="text-[10px] text-mandi-muted">{user?.phone}</p>
                </div>
                <button
                  type="button"
                  className="relative cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setIsCartOpen(true)}
                  aria-label="Open cart"
                >
                  <ShoppingCart className="h-6 w-6 text-mandi-dark" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-mandi-green text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-in zoom-in">
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
          <div className="bg-white rounded-xl shadow-sm border border-mandi-muted/10 p-6 mb-8 relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-mandi-yellow/5 rounded-full -mr-10 -mt-10 pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-mandi-green/10 text-mandi-green border-mandi-green/20 hover:bg-mandi-green/10">
                    OPEN FOR ORDERS
                  </Badge>
                  <span className="text-xs text-mandi-muted font-medium">
                    Cutoff: {new Date(currentBatch.cutoffAt).toLocaleDateString()}{' '}
                    {new Date(currentBatch.cutoffAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-mandi-dark flex items-center gap-2">
                  {currentBatch.name}
                  {availableBatches.length > 1 && (
                    <Badge
                      variant="outline"
                      className="text-[10px] font-normal text-mandi-muted border-mandi-muted/30"
                    >
                      {currentBatch.hub?.name}
                    </Badge>
                  )}
                </h2>

                <p className="text-mandi-muted text-sm mt-1 flex items-center gap-1">
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
                <div className="p-3 bg-mandi-cream rounded-lg flex items-center gap-3 border border-mandi-earth/10">
                  <MapPin className="h-5 w-5 text-mandi-earth" />
                  <div>
                    <p className="text-[10px] uppercase text-mandi-muted font-bold">Pickup Point</p>
                    <p className="text-xs font-medium text-mandi-dark max-w-[200px] truncate">
                      {currentBatch.hub?.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State for Products */}
          {loadingProducts ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-mandi-green/50 mb-2" />
              <p className="text-sm text-mandi-muted">Updating produce list...</p>
            </div>
          ) : (
            <div className="space-y-12 animate-in fade-in duration-500">
              {products.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border border-dashed border-mandi-muted/30">
                  <div className="w-16 h-16 bg-mandi-cream rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="h-8 w-8 text-mandi-muted" />
                  </div>
                  <h3 className="text-lg font-medium text-mandi-dark">No produce listed yet</h3>
                  <p className="text-mandi-muted text-sm mt-1">
                    Farmers haven't added any products to this batch yet. Check back soon!
                  </p>
                </div>
              ) : (
                Object.entries(productsByFarmer).map(
                  ([farmerId, { farmer, products: farmerProducts }]) => (
                    <div key={farmerId}>
                      <FarmerTrustHeader farmer={farmer} productCount={farmerProducts.length} />
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {farmerProducts.map((bp) => (
                          <ProductCard
                            key={bp.id}
                            batchProduct={bp}
                            quantity={
                              cartItems.find((i) => i.batchProductId === bp.id)?.quantity || 0
                            }
                            onQuantityChange={(qty) => handleUpdateQuantity(bp, qty)}
                          />
                        ))}
                      </div>
                    </div>
                  )
                )
              )}
            </div>
          )}
        </main>

        {/* Floating Cart / Checkout Bar (Mobile & Desktop Sidebar) */}
        {cartItemsCount > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-mandi-muted/20 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] p-4 z-40 animate-in slide-in-from-bottom duration-300">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6 w-full md:w-auto overflow-x-auto py-1 scrollbar-hide">
                <div className="flex-shrink-0">
                  <p className="text-[10px] uppercase text-mandi-muted font-bold">
                    Estimated Total
                  </p>
                  <p className="text-xl font-bold text-mandi-green">₹{cartTotal.toFixed(2)}</p>
                </div>
                <Separator
                  orientation="vertical"
                  className="h-8 hidden md:block bg-mandi-muted/20"
                />
                <div className="flex items-center gap-2 bg-mandi-cream p-1.5 rounded-lg border border-mandi-earth/10">
                  <Button
                    variant={fulfillmentType === 'PICKUP' ? 'default' : 'ghost'}
                    size="sm"
                    className={`h-7 text-xs gap-1.5 rounded-md ${fulfillmentType === 'PICKUP' ? 'bg-mandi-dark text-white shadow-sm' : 'text-mandi-muted hover:text-mandi-dark'}`}
                    onClick={() => setFulfillmentType('PICKUP')}
                  >
                    <MapPin className="h-3 w-3" /> Pickup
                  </Button>
                  <Button
                    variant={fulfillmentType === 'DELIVERY' ? 'default' : 'ghost'}
                    size="sm"
                    className={`h-7 text-xs gap-1.5 rounded-md ${fulfillmentType === 'DELIVERY' ? 'bg-mandi-dark text-white shadow-sm' : 'text-mandi-muted hover:text-mandi-dark'}`}
                    onClick={() => setFulfillmentType('DELIVERY')}
                  >
                    <Truck className="h-3 w-3" /> Delivery
                  </Button>
                </div>
              </div>

              <div className="w-full md:w-auto flex flex-col gap-2">
                <Button
                  className="w-full md:w-64 h-12 text-lg font-bold gap-2 shadow-lg shadow-mandi-green/20 hover:shadow-mandi-green/30 transition-all"
                  disabled={!isCartValid()}
                  onClick={() =>
                    navigate('/shop/checkout', {
                      state: { fulfillmentType, batchId: currentBatch.id },
                    })
                  }
                >
                  Checkout <ArrowRight className="h-5 w-5" />
                </Button>
                {!isCartValid() && (
                  <p className="text-center md:text-right text-[10px] text-red-500 font-medium animate-pulse">
                    Some items do not meet min order quantity.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </>
  );
}
