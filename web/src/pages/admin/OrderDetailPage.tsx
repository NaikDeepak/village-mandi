import { Button } from '@/components/ui/button';
import { ordersApi, paymentsApi } from '@/lib/api';
import type { Order, OrderItem, Payment } from '@/types';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

type DetailedOrder = Order & {
  buyer: { name: string; phone: string; email?: string };
  batch: { name: string; hub: { name: string } };
  payments: Payment[];
  items: (OrderItem & { batchProduct: { product: { name: string; unit: string } } })[];
};

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<DetailedOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Payment Form State
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CASH'>('UPI');
  const [paymentStage, setPaymentStage] = useState<'COMMITMENT' | 'FINAL'>('COMMITMENT');
  const [referenceId, setReferenceId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await ordersApi.getById(id!);
      if (res.error) throw new Error(res.error);
      setOrder(res.data?.order || null);

      // Auto-set suggested payment amount
      if (res.data?.order) {
        const o = res.data.order;
        if (o.status === 'PLACED') {
          setPaymentAmount(Math.round(o.estimatedTotal * 0.1));
          setPaymentStage('COMMITMENT');
        } else if (o.status === 'COMMITMENT_PAID') {
          const paid = o.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
          setPaymentAmount(o.estimatedTotal - paid);
          setPaymentStage('FINAL');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  const handleLogPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    try {
      setSubmitting(true);
      const res = await paymentsApi.logPayment(order.id, {
        amount: paymentAmount,
        method: paymentMethod,
        stage: paymentStage,
        referenceId: referenceId || undefined,
        paidAt: new Date().toISOString(),
      });

      if (res.error) throw new Error(res.error);

      setShowPaymentForm(false);
      setReferenceId('');
      fetchOrder(); // Refresh
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to log payment');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'PLACED':
        return 'bg-blue-100 text-blue-800';
      case 'COMMITMENT_PAID':
        return 'bg-yellow-100 text-yellow-800';
      case 'FULLY_PAID':
        return 'bg-green-100 text-green-800';
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

  if (loading) return <div className="p-8">Loading...</div>;
  if (!order) return <div className="p-8">Order not found.</div>;

  const totalPaid = order.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
  const balance = order.estimatedTotal - totalPaid;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center gap-4">
        <Link to="/admin/orders" className="text-mandi-green hover:underline">
          &larr; Back to Orders
        </Link>
      </div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-mandi-dark">Order #{order.id.slice(-6)}</h1>
          <p className="text-mandi-muted">Placed on {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}
          >
            {order.status}
          </span>
          {order.status !== 'FULLY_PAID' && order.status !== 'CANCELLED' && (
            <Button onClick={() => setShowPaymentForm(true)}>Log Payment</Button>
          )}
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded mb-6">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Items & Summary */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-mandi-dark mb-4">Order Items</h2>
            <div className="divide-y divide-gray-200">
              {order.items?.map((item) => (
                <div key={item.id} className="py-4 flex justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{item.batchProduct?.product.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} {item.batchProduct?.product.unit} &times;{' '}
                      {formatCurrency(item.pricePerUnit)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(item.subtotal)}</p>
                    <p className="text-xs text-gray-500">
                      Incl. facilitation: {formatCurrency(item.facilitationAmt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(order.estimatedTotal - order.facilitationAmt)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Facilitation Fee</span>
                <span>{formatCurrency(order.facilitationAmt)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-mandi-dark pt-2">
                <span>Estimated Total</span>
                <span>{formatCurrency(order.estimatedTotal)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-mandi-dark mb-4">Payment History</h2>
            {order.payments && order.payments.length > 0 ? (
              <div className="space-y-4">
                {order.payments.map((p) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {p.stage} Payment - {p.method}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(p.paidAt).toLocaleDateString()}{' '}
                        {p.referenceId ? `| Ref: ${p.referenceId}` : ''}
                      </p>
                    </div>
                    <p className="font-bold text-mandi-green">{formatCurrency(p.amount)}</p>
                  </div>
                ))}
                <div className="border-t pt-4 flex justify-between items-center">
                  <span className="font-medium">Total Paid</span>
                  <span className="font-bold text-mandi-green">{formatCurrency(totalPaid)}</span>
                </div>
                {balance > 0 && (
                  <div className="flex justify-between items-center text-red-600">
                    <span className="font-medium">Remaining Balance</span>
                    <span className="font-bold">{formatCurrency(balance)}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 italic">No payments logged yet.</p>
            )}
          </div>
        </div>

        {/* Right Column: Customer & Batch Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-mandi-dark mb-4">Customer Details</h2>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-gray-500">Name:</span> {order.buyer.name}
              </p>
              <p className="text-sm">
                <span className="text-gray-500">Phone:</span> {order.buyer.phone}
              </p>
              {order.buyer.email && (
                <p className="text-sm">
                  <span className="text-gray-500">Email:</span> {order.buyer.email}
                </p>
              )}
              <p className="text-sm mt-4">
                <span className="text-gray-500">Fulfillment:</span>
                <span className="ml-2 font-medium">{order.fulfillmentType}</span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-mandi-dark mb-4">Batch Information</h2>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-gray-500">Batch:</span> {order.batch.name}
              </p>
              <p className="text-sm">
                <span className="text-gray-500">Hub:</span> {order.batch.hub.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Log Payment</h2>
            <form onSubmit={handleLogPayment} className="space-y-4">
              <div>
                <label htmlFor="paymentStage" className="block text-sm font-medium text-gray-700">
                  Stage
                </label>
                <select
                  id="paymentStage"
                  value={paymentStage}
                  onChange={(e) => setPaymentStage(e.target.value as 'COMMITMENT' | 'FINAL')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mandi-green focus:ring-mandi-green"
                  disabled={order.status !== 'PLACED' && order.status !== 'COMMITMENT_PAID'}
                >
                  <option value="COMMITMENT">Commitment (10%)</option>
                  <option value="FINAL">Final Payment</option>
                </select>
              </div>

              <div>
                <label htmlFor="paymentAmount" className="block text-sm font-medium text-gray-700">
                  Amount (₹)
                </label>
                <input
                  id="paymentAmount"
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mandi-green focus:ring-mandi-green"
                />
              </div>

              <div>
                <span className="block text-sm font-medium text-gray-700">Method</span>
                <div className="mt-2 flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                      className="text-mandi-green focus:ring-mandi-green"
                    />
                    <span className="ml-2">UPI</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={paymentMethod === 'CASH'}
                      onChange={() => setPaymentMethod('CASH')}
                      className="text-mandi-green focus:ring-mandi-green"
                    />
                    <span className="ml-2">Cash</span>
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="referenceId" className="block text-sm font-medium text-gray-700">
                  Reference ID (Optional)
                </label>
                <input
                  id="referenceId"
                  type="text"
                  placeholder="UPI Transaction ID or receipt #"
                  value={referenceId}
                  onChange={(e) => setReferenceId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mandi-green focus:ring-mandi-green"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowPaymentForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Log Payment'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
