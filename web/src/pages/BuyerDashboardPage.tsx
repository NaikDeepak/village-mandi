import { OrderCard } from '@/components/buyer/OrderCard';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { authApi, logsApi, ordersApi } from '@/lib/api';
import { getWhatsAppLink, templates } from '@/lib/communication';
import { useAuthStore } from '@/stores/auth';
import type { Order } from '@/types';
import { History, Loader2, MessageCircle, ShoppingBag } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function BuyerDashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await ordersApi.getMyOrders();
      if (res.error) throw new Error(res.error);
      setOrders(res.data?.orders || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleContactSupport = async () => {
    if (!user) return;

    const message = templates.supportRequest(user.name);
    // In a real app, this would be the actual Hub Manager's phone.
    // For now, we'll open a blank chat or a placeholder.
    const link = getWhatsAppLink('', message);
    window.open(link, '_blank');

    // Log the support request event
    // Attach to the latest active order if available, otherwise latest history order
    // If no orders exist, we skip logging to avoid FK constraint errors with invalid IDs
    const associatedOrder = activeOrders[0] || historyOrders[0];

    if (associatedOrder) {
      await logsApi.logCommunication({
        entityType: 'ORDER',
        entityId: associatedOrder.id,
        messageType: 'SUPPORT_REQUEST',
        recipientPhone: 'HUB_MANAGER',
      });
    }
  };

  const handleLogout = async () => {
    await authApi.logout();
    logout();
    navigate('/buyer-login');
  };

  // Split orders into Active and History
  // Active: associated batch is NOT 'SETTLED'
  const activeOrders = orders.filter((o) => o.batch?.status !== 'SETTLED');
  const historyOrders = orders.filter((o) => o.batch?.status === 'SETTLED');

  // Most recent active order
  const latestActiveOrder = activeOrders[0];
  const otherActiveOrders = activeOrders.slice(1);

  return (
    <>
      <Navbar variant="internal" />
      <div className="min-h-screen bg-mandi-cream/30">
        <header className="bg-white border-b border-mandi-muted/20 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-mandi-dark">Virtual Mandi</h1>
                <span className="text-xs bg-mandi-earth/10 text-mandi-earth px-2 py-0.5 rounded font-medium">
                  Buyer
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-bold text-mandi-dark leading-none">{user?.name}</p>
                  <p className="text-[10px] text-mandi-muted">{user?.phone}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleContactSupport}
                  className="text-mandi-green border-mandi-green hover:bg-mandi-green/10"
                >
                  <MessageCircle size={16} className="mr-2" />
                  Support
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <Loader2 className="animate-spin text-mandi-green mb-2" size={32} />
              <p className="text-mandi-muted">Loading your dashboard...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center">
              <p>{error}</p>
              <Button variant="outline" size="sm" onClick={fetchOrders} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Active Orders Section */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingBag className="text-mandi-green" size={20} />
                  <h2 className="text-xl font-bold text-mandi-dark">Active Order</h2>
                </div>

                {latestActiveOrder ? (
                  <div className="space-y-6">
                    <OrderCard order={latestActiveOrder} isActive={true} />

                    {otherActiveOrders.length > 0 && (
                      <div className="grid gap-6">
                        {otherActiveOrders.map((order) => (
                          <OrderCard key={order.id} order={order} />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm border border-dashed border-gray-300 p-10 text-center">
                    <div className="bg-mandi-cream/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-mandi-muted">
                      <ShoppingBag size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-mandi-dark">No active orders</h3>
                    <p className="text-mandi-muted text-sm mt-1 mb-6">
                      You haven't placed any orders in the current open batches.
                    </p>
                    <Button
                      onClick={() => navigate('/shop')}
                      className="bg-mandi-green hover:bg-mandi-green/90"
                    >
                      Browse Products
                    </Button>
                  </div>
                )}
              </section>

              {/* Order History Section */}
              {historyOrders.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <History className="text-mandi-muted" size={20} />
                    <h2 className="text-xl font-bold text-mandi-dark">Order History</h2>
                  </div>
                  <div className="space-y-4">
                    {historyOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white rounded-lg border border-gray-100 p-4 flex justify-between items-center shadow-sm"
                      >
                        <div>
                          <p className="font-bold text-mandi-dark">
                            {order.batch?.name || 'Past Order'}
                          </p>
                          <p className="text-xs text-mandi-muted">
                            {new Date(order.createdAt).toLocaleDateString()} •{' '}
                            {order.items?.length || 0} items
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-mandi-dark">
                            {new Intl.NumberFormat('en-IN', {
                              style: 'currency',
                              currency: 'INR',
                            }).format(order.estimatedTotal)}
                          </p>
                          <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded uppercase font-bold tracking-tight">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
