import { Button } from '@/components/ui/button';
import { batchesApi, logsApi } from '@/lib/api';
import { getWhatsAppLink, templates } from '@/lib/communication';
import type { Batch } from '@/types';
import { MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const STATUS_COLORS = {
  DRAFT: 'bg-gray-100 text-gray-800',
  OPEN: 'bg-green-100 text-green-800',
  CLOSED: 'bg-yellow-100 text-yellow-800',
  COLLECTED: 'bg-blue-100 text-blue-800',
  DELIVERED: 'bg-purple-100 text-purple-800',
  SETTLED: 'bg-gray-700 text-white',
};

type FilterTab = 'all' | 'active' | 'completed';

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getCutoffStatus(cutoffAt: string): { text: string; urgent: boolean } {
  const now = new Date();
  const cutoff = new Date(cutoffAt);
  const diff = cutoff.getTime() - now.getTime();

  if (diff < 0) {
    return { text: 'Cutoff passed', urgent: true };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return { text: `${days} day${days > 1 ? 's' : ''} remaining`, urgent: false };
  }
  if (hours > 0) {
    return { text: `${hours} hour${hours > 1 ? 's' : ''} remaining`, urgent: hours <= 6 };
  }

  const minutes = Math.floor(diff / (1000 * 60));
  return { text: `${minutes} min remaining`, urgent: true };
}

export function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [currentBatch, setCurrentBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterTab, setFilterTab] = useState<FilterTab>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [batchesRes, currentRes] = await Promise.all([
        batchesApi.getAll(),
        batchesApi.getCurrent(),
      ]);

      if (batchesRes.error) throw new Error(batchesRes.error);
      if (currentRes.error) throw new Error(currentRes.error);

      setBatches(batchesRes.data?.batches || []);
      setCurrentBatch(currentRes.data?.batch || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch batches');
    } finally {
      setLoading(false);
    }
  };

  const filteredBatches = batches.filter((batch) => {
    if (filterTab === 'active') {
      return ['DRAFT', 'OPEN', 'CLOSED'].includes(batch.status);
    }
    if (filterTab === 'completed') {
      return ['COLLECTED', 'DELIVERED', 'SETTLED'].includes(batch.status);
    }
    return true; // all
  });

  const handleNotifyBuyers = async () => {
    if (!currentBatch) return;

    const message = templates.batchOpen(currentBatch.name, formatDate(currentBatch.deliveryDate));

    // In a real app, this might go to a broadcast list or multiple buyers.
    // For now, we'll open it with a blank phone or a placeholder to let the admin choose.
    const whatsappLink = getWhatsAppLink('', message);
    window.open(whatsappLink, '_blank');

    // Log the event
    await logsApi.logCommunication({
      entityType: 'BATCH',
      entityId: currentBatch.id,
      messageType: 'BATCH_OPEN',
      recipientPhone: 'BROADCAST',
    });
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-mandi-dark">Batches</h1>
        <Link to="/admin/batches/new">
          <Button>Add Batch</Button>
        </Link>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded mb-4">{error}</div>}

      {/* Hero Section - Current Batch */}
      {currentBatch ? (
        <div className="bg-gradient-to-r from-mandi-green to-green-700 text-white p-6 rounded-lg shadow-lg mb-8">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{currentBatch.name}</h2>
                <span className="px-3 py-1 bg-white text-mandi-green text-sm font-semibold rounded-full">
                  OPEN
                </span>
              </div>
              <p className="text-green-100 mb-4">Hub: {currentBatch.hub?.name || 'N/A'}</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-green-100 text-sm">Cutoff</p>
                  <p className="font-semibold">{formatDateTime(currentBatch.cutoffAt)}</p>
                  {(() => {
                    const status = getCutoffStatus(currentBatch.cutoffAt);
                    return (
                      <p
                        className={`text-sm font-medium ${status.urgent ? 'text-yellow-300' : 'text-green-100'}`}
                      >
                        {status.text}
                      </p>
                    );
                  })()}
                </div>
                <div>
                  <p className="text-green-100 text-sm">Delivery Date</p>
                  <p className="font-semibold">{formatDate(currentBatch.deliveryDate)}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link to={`/admin/batches/${currentBatch.id}`}>
                <Button
                  variant="outline"
                  className="w-full bg-white text-mandi-green hover:bg-gray-100"
                >
                  View Details
                </Button>
              </Link>
              <Button
                onClick={handleNotifyBuyers}
                className="w-full bg-white text-mandi-green hover:bg-gray-100 border-white"
                variant="outline"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Notify Buyers
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 p-8 rounded-lg text-center mb-8">
          <p className="text-gray-600 mb-4">No active batch</p>
          <Link to="/admin/batches/new">
            <Button>Create Batch</Button>
          </Link>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setFilterTab('all')}
          className={`px-4 py-2 rounded-lg font-medium ${filterTab === 'all' ? 'bg-mandi-green text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setFilterTab('active')}
          className={`px-4 py-2 rounded-lg font-medium ${filterTab === 'active' ? 'bg-mandi-green text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Active
        </button>
        <button
          type="button"
          onClick={() => setFilterTab('completed')}
          className={`px-4 py-2 rounded-lg font-medium ${filterTab === 'completed' ? 'bg-mandi-green text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Completed
        </button>
      </div>

      {/* Batch List Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hub
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cutoff
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Delivery Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBatches.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No batches found
                </td>
              </tr>
            ) : (
              filteredBatches.map((batch) => (
                <tr key={batch.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{batch.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {batch.hub?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_COLORS[batch.status]}`}
                    >
                      {batch.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateTime(batch.cutoffAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(batch.deliveryDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/admin/batches/${batch.id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      View
                    </Link>
                    {batch.status === 'DRAFT' && (
                      <Link
                        to={`/admin/batches/${batch.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </Link>
                    )}
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
