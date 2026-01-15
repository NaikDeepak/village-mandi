import { Button } from '@/components/ui/button';
import { logsApi, payoutsApi } from '@/lib/api';
import { getWhatsAppLink, templates } from '@/lib/communication';
import type {
  BatchPayoutsResponse,
  CreatePayoutInput,
  FarmerPayout,
  FarmerPayoutSummary,
} from '@/types';
import { IndianRupee, Landmark, Loader2, MessageSquare, User } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export function BatchPayoutsPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<BatchPayoutsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Payout Form State
  const [showPayoutForm, setShowPayoutForm] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerPayoutSummary | null>(null);
  const [payoutAmount, setPayoutAmount] = useState(0);
  const [upiReference, setUpiReference] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPayouts = useCallback(async (batchId: string) => {
    try {
      setLoading(true);
      const res = await payoutsApi.getByBatch(batchId);
      if (res.error) throw new Error(res.error);
      setData(res.data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payout data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchPayouts(id);
    }
  }, [id, fetchPayouts]);

  const handleNotifyPayout = async (payout: FarmerPayout) => {
    if (!id) return;

    const message = templates.payoutConfirmation(
      payout.amount,
      'Village Mandi Batch', // We don't have batch name here, but id is available.
      payout.upiReference
    );

    // Farmers don't have phones in this view either, would need to fetch or open blank
    const link = getWhatsAppLink('', message);
    window.open(link, '_blank');

    // Log communication
    try {
      await logsApi.logCommunication({
        entityType: 'FARMER',
        entityId: payout.farmerId,
        messageType: 'PAYOUT_CONFIRMATION',
        recipientPhone: 'OPEN_CHAT',
        metadata: { payoutId: payout.id, amount: payout.amount, batchId: id },
      });
    } catch (error) {
      console.error('Failed to log communication:', error);
    }
  };

  const handleLogPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !selectedFarmer) return;

    try {
      setSubmitting(true);
      const payoutData: CreatePayoutInput = {
        farmerId: selectedFarmer.farmerId,
        amount: payoutAmount,
        upiReference,
        paidAt: new Date().toISOString(),
      };

      const res = await payoutsApi.logPayout(id, payoutData);
      if (res.error) throw new Error(res.error);

      setShowPayoutForm(false);
      setUpiReference('');
      fetchPayouts(id); // Refresh
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to log payout');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-mandi-green mb-2" size={32} />
        <p className="text-mandi-muted">Loading payout data...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded mb-4">{error || 'Batch not found'}</div>
        <Link to="/admin/batches">
          <Button variant="outline">&larr; Back to Batches</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          to={`/admin/batches/${id}`}
          className="text-sm text-mandi-muted hover:text-mandi-green"
        >
          &larr; Back to Batch Details
        </Link>
        <h1 className="text-2xl font-bold text-mandi-dark mt-2">Farmer Payouts</h1>
        <p className="text-mandi-muted">Manage payments to farmers for this batch</p>
      </div>

      <div className="space-y-8">
        {/* Farmer Summary Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-bold text-mandi-dark">Farmer Balances</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Farmer
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Owed
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Paid
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.farmers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-mandi-muted italic">
                      No orders found for this batch.
                    </td>
                  </tr>
                ) : (
                  data.farmers.map((farmer) => (
                    <tr key={farmer.farmerId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{farmer.name}</div>
                        <div className="text-xs text-mandi-muted">{farmer.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {formatCurrency(farmer.totalOwed)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-mandi-green font-medium">
                        {formatCurrency(farmer.totalPaid)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-mandi-dark">
                        <span className={farmer.balance > 0 ? 'text-red-600' : 'text-gray-900'}>
                          {formatCurrency(farmer.balance)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          size="sm"
                          disabled={farmer.balance <= 0}
                          onClick={() => {
                            setSelectedFarmer(farmer);
                            setPayoutAmount(farmer.balance);
                            setShowPayoutForm(true);
                          }}
                        >
                          Log Payout
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payout History */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-bold text-mandi-dark">Payment History</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {data.payouts.length === 0 ? (
              <div className="px-6 py-8 text-center text-mandi-muted italic">
                No payouts logged yet for this batch.
              </div>
            ) : (
              data.payouts.map((payout) => (
                <div key={payout.id} className="px-6 py-4 flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <div className="bg-mandi-cream/20 p-2 rounded-full text-mandi-green">
                      <Landmark size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{payout.farmer.name}</p>
                      <p className="text-xs text-mandi-muted">
                        {new Date(payout.paidAt).toLocaleDateString()} | Ref: {payout.upiReference}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <p className="font-bold text-mandi-green">{formatCurrency(payout.amount)}</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-mandi-green hover:text-mandi-green hover:bg-mandi-green/10"
                      onClick={() => handleNotifyPayout(payout)}
                    >
                      <MessageSquare size={16} />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Payout Modal */}
      {showPayoutForm && selectedFarmer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-2 mb-4 text-mandi-dark">
              <IndianRupee className="text-mandi-green" />
              <h2 className="text-xl font-bold">Log Farmer Payout</h2>
            </div>

            <div className="bg-gray-50 p-3 rounded mb-4 flex items-center gap-3">
              <div className="bg-white p-2 rounded-full shadow-sm">
                <User size={16} className="text-mandi-muted" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{selectedFarmer.name}</p>
                <p className="text-xs text-mandi-muted">
                  Balance: {formatCurrency(selectedFarmer.balance)}
                </p>
              </div>
            </div>

            <form onSubmit={handleLogPayout} className="space-y-4">
              <div>
                <label htmlFor="payoutAmount" className="block text-sm font-medium text-gray-700">
                  Amount (₹)
                </label>
                <input
                  id="payoutAmount"
                  type="number"
                  required
                  min="1"
                  max={selectedFarmer.balance}
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mandi-green focus:ring-mandi-green"
                />
              </div>

              <div>
                <label htmlFor="upiReference" className="block text-sm font-medium text-gray-700">
                  UPI Reference / Transaction ID
                </label>
                <input
                  id="upiReference"
                  type="text"
                  required
                  placeholder="e.g. 1234567890"
                  value={upiReference}
                  onChange={(e) => setUpiReference(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mandi-green focus:ring-mandi-green"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowPayoutForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={submitting}>
                  {submitting ? 'Logging...' : 'Log Payout'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
