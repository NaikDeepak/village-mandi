import { Button } from '@/components/ui/button';
import { batchesApi, packingApi } from '@/lib/api';
import type { Batch, Order, OrderItem } from '@/types';
import { CheckCircle2, Package, Printer, Truck } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

type PackingOrder = Order & {
  buyer: { id: string; name: string; phone: string };
  items: (OrderItem & { batchProduct: { product: { name: string; unit: string } } })[];
};

export function BatchPackingPage() {
  const { id } = useParams<{ id: string }>();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [orders, setOrders] = useState<PackingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchData = useCallback(async (batchId: string) => {
    try {
      setLoading(true);
      const [batchRes, packingRes] = await Promise.all([
        batchesApi.getById(batchId),
        packingApi.getPackingList(batchId),
      ]);

      if (batchRes.error) throw new Error(batchRes.error);
      if (packingRes.error) throw new Error(packingRes.error);

      setBatch(batchRes.data?.batch || null);
      setOrders((packingRes.data?.orders as PackingOrder[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch packing data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id, fetchData]);

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      setUpdatingId(orderId);
      const res = await packingApi.updateOrderStatus(orderId, newStatus);
      if (res.error) throw new Error(res.error);

      // Update local state
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="p-8 text-center text-mandi-muted">Loading packing data...</div>;
  }

  if (error || !batch) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded mb-4">{error || 'Batch not found'}</div>
        <Link to="/admin/batches">
          <Button variant="outline">&larr; Back to Batches</Button>
        </Link>
      </div>
    );
  }

  const stats = {
    total: orders.length,
    packed: orders.filter((o) => o.status === 'PACKED' || o.status === 'DISTRIBUTED').length,
    distributed: orders.filter((o) => o.status === 'DISTRIBUTED').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0">
      <div className="mb-6 flex justify-between items-center print:hidden">
        <Link
          to={`/admin/batches/${batch.id}`}
          className="text-sm text-mandi-muted hover:text-mandi-green"
        >
          &larr; Back to Batch Details
        </Link>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="flex items-center gap-2"
          >
            <Printer size={16} /> Print Slips
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-8 print:shadow-none print:border">
        <div className="p-6 border-b border-gray-200 bg-mandi-cream/10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-mandi-dark">Packing & Distribution</h1>
              <p className="text-mandi-muted mt-1">
                Batch: <span className="font-semibold text-mandi-dark">{batch.name}</span> | Hub:{' '}
                <span className="font-semibold text-mandi-dark">{batch.hub?.name}</span>
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <span className="text-sm text-mandi-muted block uppercase tracking-wider">
                Progress
              </span>
              <div className="flex gap-4 mt-1">
                <div className="text-center">
                  <p className="text-xs text-mandi-muted uppercase">Packed</p>
                  <p className="font-bold text-mandi-dark">
                    {stats.packed}/{stats.total}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-mandi-muted uppercase">Delivered</p>
                  <p className="font-bold text-mandi-dark">
                    {stats.distributed}/{stats.total}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-mandi-muted italic">
              No orders ready for packing in this batch yet.
            </p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className={`bg-white rounded-lg shadow overflow-hidden border-l-4 print:shadow-none print:border break-inside-avoid ${
                order.status === 'DISTRIBUTED'
                  ? 'border-purple-500'
                  : order.status === 'PACKED'
                    ? 'border-green-500'
                    : 'border-blue-500'
              }`}
            >
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h3 className="font-bold text-mandi-dark">{order.buyer.name}</h3>
                  <p className="text-xs text-mandi-muted">{order.buyer.phone}</p>
                </div>
                <div className="flex items-center gap-3 print:hidden">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      order.status === 'DISTRIBUTED'
                        ? 'bg-purple-100 text-purple-800'
                        : order.status === 'PACKED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {order.status}
                  </span>

                  {order.status === 'FULLY_PAID' && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(order.id, 'PACKED')}
                      disabled={updatingId === order.id}
                      className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                    >
                      <Package size={14} /> Mark Packed
                    </Button>
                  )}

                  {order.status === 'PACKED' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(order.id, 'FULLY_PAID')}
                        disabled={updatingId === order.id}
                        className="text-xs"
                      >
                        Undo
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(order.id, 'DISTRIBUTED')}
                        disabled={updatingId === order.id}
                        className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700"
                      >
                        <Truck size={14} /> Mark Distributed
                      </Button>
                    </div>
                  )}

                  {order.status === 'DISTRIBUTED' && (
                    <div className="flex items-center gap-1 text-purple-600 font-medium text-sm">
                      <CheckCircle2 size={16} /> Distributed
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleStatusUpdate(order.id, 'PACKED')}
                        disabled={updatingId === order.id}
                        className="text-xs ml-2 text-mandi-muted"
                      >
                        Undo
                      </Button>
                    </div>
                  )}
                </div>
                <div className="hidden print:block text-right">
                  <p className="text-xs font-bold uppercase">Order ID: {order.id.slice(-6)}</p>
                  <p className="text-xs">{order.fulfillmentType}</p>
                </div>
              </div>

              <div className="p-4">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left text-xs text-mandi-muted uppercase tracking-wider">
                      <th className="pb-2">Item</th>
                      <th className="pb-2 text-center">Qty</th>
                      <th className="pb-2 text-right print:hidden">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2 text-sm text-mandi-dark">
                          {item.batchProduct?.product.name}
                        </td>
                        <td className="py-2 text-sm font-bold text-center">
                          {item.quantity} {item.batchProduct?.product.unit}
                        </td>
                        <td className="py-2 text-right print:hidden">
                          <div className="h-4 w-4 rounded border border-gray-300 ml-auto" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {order.fulfillmentType === 'DELIVERY' && (
                  <div className="mt-4 p-2 bg-blue-50 rounded border border-blue-100 text-xs text-blue-800">
                    <strong>Delivery Order:</strong> Please ensure address is verified.
                  </div>
                )}
              </div>
              <div className="bg-gray-50 p-2 text-center border-t border-gray-100 hidden print:block">
                <p className="text-[10px] text-mandi-muted italic">
                  Thank you for supporting your local farmers! - Village Mandi
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
