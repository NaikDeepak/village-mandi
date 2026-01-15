import { Navbar } from '@/components/layout/Navbar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { batchProductsApi, ordersApi } from '@/lib/api';
import type { BatchProduct, Order } from '@/types';
import { ChevronLeft, Loader2, MapPin, Minus, Plus, Save, Trash2, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface EditedItem {
  batchProductId: string;
  productId: string;
  name: string;
  unit: string;
  pricePerUnit: number;
  facilitationPercent: number;
  farmerName?: string;
  quantity: number;
  minOrderQty: number;
  maxOrderQty?: number | null;
}

export function EditOrderPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [allProducts, setAllProducts] = useState<BatchProduct[]>([]);
  const [editedItems, setEditedItems] = useState<EditedItem[]>([]);
  const [fulfillmentType, setFulfillmentType] = useState<'PICKUP' | 'DELIVERY'>('PICKUP');

  useEffect(() => {
    const fetchData = async () => {
      if (!orderId) return;
      setLoading(true);
      try {
        const orderRes = await ordersApi.getById(orderId);
        if (orderRes.data) {
          const fetchedOrder = orderRes.data.order;

          // Verify if order is editable
          const isEditable =
            fetchedOrder.status === 'PLACED' &&
            fetchedOrder.batch?.status === 'OPEN' &&
            new Date(fetchedOrder.batch.cutoffAt) > new Date();

          if (!isEditable) {
            toast({
              title: 'Order Not Editable',
              description:
                'This order can no longer be edited because the cutoff has passed or it is already being processed.',
              variant: 'destructive',
            });
            navigate('/buyer-dashboard');
            return;
          }

          setOrder(fetchedOrder);
          setFulfillmentType(fetchedOrder.fulfillmentType);

          // Map existing items to editedItems state
          const initialItems: EditedItem[] =
            fetchedOrder.items?.map((item) => ({
              batchProductId: item.batchProductId,
              productId: item.batchProduct?.productId || '',
              name: item.batchProduct?.product.name || 'Unknown',
              unit: item.batchProduct?.product.unit || '',
              pricePerUnit:
                item.unitPrice / (1 + (item.batchProduct?.facilitationPercent || 0) / 100),
              facilitationPercent: item.batchProduct?.facilitationPercent || 0,
              farmerName: item.batchProduct?.product.farmer?.name,
              quantity: item.orderedQty,
              minOrderQty: item.batchProduct?.minOrderQty || 0,
              maxOrderQty: item.batchProduct?.maxOrderQty,
            })) || [];
          setEditedItems(initialItems);

          // Fetch all products for the batch to allow adding new ones
          const productsRes = await batchProductsApi.getByBatch(fetchedOrder.batchId, true);
          if (productsRes.data) {
            setAllProducts(productsRes.data.products);
          }
        } else {
          toast({
            title: 'Order Not Found',
            description: orderRes.error || 'Failed to load order details.',
            variant: 'destructive',
          });
          navigate('/buyer-dashboard');
        }
      } catch (error) {
        console.error('Failed to fetch order data:', error);
        toast({
          title: 'Error',
          description: 'An unexpected error occurred.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId, navigate, toast]);

  const updateItemQuantity = (batchProductId: string, qty: number) => {
    setEditedItems((prev) => {
      const existing = prev.find((i) => i.batchProductId === batchProductId);
      if (existing) {
        if (qty <= 0) {
          return prev.filter((i) => i.batchProductId !== batchProductId);
        }
        return prev.map((i) => (i.batchProductId === batchProductId ? { ...i, quantity: qty } : i));
      }

      const product = allProducts.find((p) => p.id === batchProductId);
      if (product && qty > 0) {
        return [
          ...prev,
          {
            batchProductId: product.id,
            productId: product.productId,
            name: product.product.name,
            unit: product.product.unit,
            pricePerUnit: product.pricePerUnit,
            facilitationPercent: product.facilitationPercent,
            farmerName: product.product.farmer?.name,
            quantity: qty,
            minOrderQty: product.minOrderQty,
            maxOrderQty: product.maxOrderQty,
          },
        ];
      }
      return prev;
    });
  };

  const calculateTotal = () => {
    return editedItems.reduce((sum, item) => {
      const priceWithFee = item.pricePerUnit * (1 + item.facilitationPercent / 100);
      return sum + priceWithFee * item.quantity;
    }, 0);
  };

  const hasChanges = () => {
    if (!order) return false;

    // Check fulfillment change
    if (fulfillmentType !== order.fulfillmentType) return true;

    // Check items change
    const originalItems = order.items || [];
    if (editedItems.length !== originalItems.length) return true;

    for (const item of editedItems) {
      const original = originalItems.find((oi) => oi.batchProductId === item.batchProductId);
      if (!original || original.orderedQty !== item.quantity) return true;
    }

    return false;
  };

  const isValid = () => {
    if (editedItems.length === 0) return true; // Will trigger cancellation if saved empty
    return editedItems.every(
      (item) =>
        item.quantity >= item.minOrderQty &&
        (!item.maxOrderQty || item.quantity <= item.maxOrderQty)
    );
  };

  const handleSave = async () => {
    if (!orderId) return;
    setSubmitting(true);
    try {
      const data = {
        fulfillmentType,
        items: editedItems.map((i) => ({
          batchProductId: i.batchProductId,
          orderedQty: i.quantity,
        })),
      };

      const res = await ordersApi.editOrder(orderId, data);
      if (res.data) {
        toast({
          title: 'Order Updated',
          description:
            editedItems.length === 0
              ? 'Your order has been cancelled.'
              : 'Your changes have been saved.',
        });
        navigate('/buyer-dashboard');
      } else {
        toast({
          title: 'Update Failed',
          description: res.error || 'Something went wrong.',
          variant: 'destructive',
        });
      }
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'Failed to update order.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!orderId) return;
    setSubmitting(true);
    try {
      const res = await ordersApi.editOrder(orderId, { items: [] });
      if (res.data) {
        toast({
          title: 'Order Cancelled',
          description: 'Your order has been successfully cancelled.',
        });
        navigate('/buyer-dashboard');
      } else {
        toast({
          title: 'Cancellation Failed',
          description: res.error || 'Something went wrong.',
          variant: 'destructive',
        });
      }
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel order.',
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
        <p className="text-mandi-dark font-medium">Loading order details...</p>
      </div>
    );
  }

  if (!order) return null;

  const productsByFarmer = allProducts.reduce(
    (acc, bp) => {
      const farmerName = bp.product.farmer?.name || 'Other';
      if (!acc[farmerName]) acc[farmerName] = [];
      acc[farmerName].push(bp);
      return acc;
    },
    {} as Record<string, BatchProduct[]>
  );

  const currentTotal = calculateTotal();

  return (
    <div className="min-h-screen bg-mandi-cream pb-24">
      <Navbar variant="internal" />

      <header className="bg-white border-b border-mandi-muted/20 shadow-sm sticky top-0 z-30 pt-20">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/buyer-dashboard')}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
          <h1 className="text-lg font-bold text-mandi-dark">Edit Order</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Batch Info */}
            <div className="bg-white rounded-xl shadow-sm border border-mandi-muted/10 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-mandi-dark">{order.batch?.name}</h2>
                  <p className="text-sm text-mandi-muted">
                    Delivery:{' '}
                    {new Date(order.batch!.deliveryDate).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })}
                  </p>
                </div>
                <Badge variant="outline" className="text-mandi-green border-mandi-green">
                  PLACED
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-mandi-muted">
                <MapPin size={14} className="text-mandi-earth" />
                <span>Pickup at: {order.batch?.hub?.name}</span>
              </div>
            </div>

            {/* Fulfillment */}
            <section className="bg-white rounded-xl shadow-sm border border-mandi-muted/10 p-6">
              <h3 className="text-lg font-bold text-mandi-dark mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5 text-mandi-green" /> Fulfillment
              </h3>
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
                  <p className="font-bold text-mandi-dark">Pickup</p>
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
                  <p className="font-bold text-mandi-dark">Delivery</p>
                </button>
              </div>
            </section>

            {/* Product List */}
            <div className="space-y-8">
              {Object.entries(productsByFarmer).map(([farmerName, products]) => (
                <div key={farmerName}>
                  <h3 className="text-md font-bold text-mandi-dark mb-4 border-l-4 border-mandi-green pl-3">
                    {farmerName}'s Produce
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {products.map((bp) => {
                      const editedItem = editedItems.find((i) => i.batchProductId === bp.id);
                      const qty = editedItem?.quantity || 0;
                      const priceWithFee = bp.pricePerUnit * (1 + bp.facilitationPercent / 100);
                      const isValidQty =
                        qty === 0 ||
                        (qty >= bp.minOrderQty && (!bp.maxOrderQty || qty <= bp.maxOrderQty));

                      return (
                        <Card
                          key={bp.id}
                          className={`border-mandi-muted/20 ${qty > 0 ? 'ring-1 ring-mandi-green/20 bg-mandi-green/[0.02]' : ''}`}
                        >
                          <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                            <div>
                              <CardTitle className="text-sm font-bold">{bp.product.name}</CardTitle>
                              <p className="text-[10px] text-mandi-muted">
                                ₹{priceWithFee.toFixed(2)} / {bp.product.unit}
                              </p>
                            </div>
                            {qty > 0 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-mandi-muted hover:text-red-500"
                                onClick={() => updateItemQuantity(bp.id, 0)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            )}
                          </CardHeader>
                          <CardContent className="px-4 pb-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center border rounded-md overflow-hidden bg-white">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-none border-r"
                                  onClick={() => updateItemQuantity(bp.id, Math.max(0, qty - 1))}
                                  disabled={qty === 0}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <Input
                                  type="number"
                                  value={qty === 0 ? '' : qty}
                                  onChange={(e) => {
                                    const val = Number.parseInt(e.target.value);
                                    updateItemQuantity(bp.id, Number.isNaN(val) ? 0 : val);
                                  }}
                                  className="h-8 w-12 border-none text-center p-0 focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  placeholder="0"
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-none border-l"
                                  onClick={() => updateItemQuantity(bp.id, qty + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="text-right">
                                {qty > 0 ? (
                                  <p className="text-sm font-bold text-mandi-dark">
                                    ₹{(priceWithFee * qty).toFixed(2)}
                                  </p>
                                ) : (
                                  <p className="text-[10px] text-mandi-muted">
                                    MOQ: {bp.minOrderQty} {bp.product.unit}
                                  </p>
                                )}
                              </div>
                            </div>
                            {!isValidQty && qty > 0 && (
                              <p className="text-[10px] text-red-500 mt-2">
                                {qty < bp.minOrderQty
                                  ? `Min: ${bp.minOrderQty}`
                                  : `Max: ${bp.maxOrderQty}`}{' '}
                                {bp.product.unit} required
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-mandi-muted/10 p-6 sticky top-40">
              <h2 className="text-lg font-bold text-mandi-dark mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-mandi-muted">Original Total</span>
                  <span className="text-mandi-dark font-medium">
                    ₹{order.estimatedTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-mandi-muted">New Total</span>
                  <span
                    className={`font-bold ${currentTotal > order.estimatedTotal ? 'text-mandi-earth' : 'text-mandi-green'}`}
                  >
                    ₹{currentTotal.toFixed(2)}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="font-bold text-mandi-dark">Difference</span>
                  <span
                    className={`font-bold ${currentTotal - order.estimatedTotal >= 0 ? 'text-mandi-earth' : 'text-mandi-green'}`}
                  >
                    {currentTotal - order.estimatedTotal >= 0 ? '+' : ''}₹
                    {(currentTotal - order.estimatedTotal).toFixed(2)}
                  </span>
                </div>
              </div>

              {editedItems.length === 0 ? (
                <div className="bg-red-50 border border-red-100 p-3 rounded-lg mb-6">
                  <p className="text-xs text-red-700 font-medium">
                    You have removed all items. Saving will cancel this order.
                  </p>
                </div>
              ) : (
                !isValid() && (
                  <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg mb-6">
                    <p className="text-xs text-amber-700 font-medium">
                      Some items don't meet the minimum quantity requirements.
                    </p>
                  </div>
                )
              )}

              <div className="space-y-3">
                <Button
                  className="w-full h-12 font-bold gap-2"
                  disabled={submitting || !hasChanges() || !isValid()}
                  onClick={handleSave}
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Save size={18} /> Save Changes
                    </>
                  )}
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 h-12"
                    >
                      Cancel Order
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will cancel your order. You can place a new order as long as the batch
                        is still open.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep Order</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleCancelOrder}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Yes, Cancel Order
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
