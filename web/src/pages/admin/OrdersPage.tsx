import { batchesApi, ordersApi } from '@/lib/api';
import type { Batch, Order } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

type OrderWithMeta = Order & {
  buyer: { name: string; phone: string };
  batch: { name: string };
};

export function OrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState<OrderWithMeta[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const batchId = searchParams.get('batchId') || '';
  const status = searchParams.get('status') || '';

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [ordersRes, batchesRes] = await Promise.all([
        ordersApi.getAll({ batchId, status }),
        batchesApi.getAll(),
      ]);

      if (ordersRes.error) throw new Error(ordersRes.error);
      if (batchesRes.error) throw new Error(batchesRes.error);

      setOrders(ordersRes.data?.orders || []);
      setBatches(batchesRes.data?.batches || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [batchId, status]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'PLACED':
        return 'bg-blue-100 text-blue-800';
      case 'COMMITMENT_PAID':
        return 'bg-yellow-100 text-yellow-800';
      case 'FULLY_PAID':
        return 'bg-green-100 text-green-800';
      case 'PACKED':
        return 'bg-blue-100 text-blue-800';
      case 'DISTRIBUTED':
        return 'bg-purple-100 text-purple-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-mandi-dark">Orders</h1>
        <div className="flex gap-4">
          <select
            value={batchId}
            onChange={(e) => {
              const newParams = new URLSearchParams(searchParams);
              if (e.target.value) newParams.set('batchId', e.target.value);
              else newParams.delete('batchId');
              setSearchParams(newParams);
            }}
            className="rounded-md border-gray-300 shadow-sm focus:border-mandi-green focus:ring-mandi-green sm:text-sm"
          >
            <option value="">All Batches</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => {
              const newParams = new URLSearchParams(searchParams);
              if (e.target.value) newParams.set('status', e.target.value);
              else newParams.delete('status');
              setSearchParams(newParams);
            }}
            className="rounded-md border-gray-300 shadow-sm focus:border-mandi-green focus:ring-mandi-green sm:text-sm"
          >
            <option value="">All Statuses</option>
            <option value="PLACED">Placed</option>
            <option value="COMMITMENT_PAID">Commitment Paid</option>
            <option value="FULLY_PAID">Fully Paid</option>
            <option value="PACKED">Packed</option>
            <option value="DISTRIBUTED">Distributed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded mb-4">{error}</div>}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Buyer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Batch
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <Link to={`/admin/orders/${order.id}`} className="hover:underline">
                      #{order.id.slice(-6)}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.buyer.name}</div>
                    <div className="text-sm text-gray-500">{order.buyer.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.batch.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {formatCurrency(order.estimatedTotal)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="text-mandi-green hover:text-mandi-green/80"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
