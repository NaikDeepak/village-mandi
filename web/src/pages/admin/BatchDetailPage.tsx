import { Button } from '@/components/ui/button';
import { batchesApi } from '@/lib/api';
import type { Batch } from '@/types';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const STATUS_COLORS: Record<Batch['status'], string> = {
  DRAFT: 'bg-gray-100 text-gray-800',
  OPEN: 'bg-green-100 text-green-800',
  CLOSED: 'bg-yellow-100 text-yellow-800',
  COLLECTED: 'bg-blue-100 text-blue-800',
  DELIVERED: 'bg-purple-100 text-purple-800',
  SETTLED: 'bg-gray-600 text-white',
};

export function BatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBatch(id);
    }
  }, [id]);

  const fetchBatch = async (batchId: string) => {
    try {
      setLoading(true);
      const res = await batchesApi.getById(batchId);
      if (res.error) throw new Error(res.error);
      setBatch(res.data?.batch || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch batch');
    } finally {
      setLoading(false);
    }
  };

  const handleTransition = async (newStatus: Batch['status']) => {
    if (!batch || !id) return;

    try {
      setTransitioning(true);
      const res = await batchesApi.transition(id, newStatus);
      if (res.error) throw new Error(res.error);
      setBatch(res.data?.batch || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to transition batch');
    } finally {
      setTransitioning(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCutoffStatus = (cutoffAt: string) => {
    const cutoff = new Date(cutoffAt);
    const now = new Date();
    if (cutoff < now) {
      return { text: 'Cutoff passed', color: 'text-red-600' };
    }
    const diff = cutoff.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return { text: `${days} day${days > 1 ? 's' : ''} remaining`, color: 'text-green-600' };
    }
    return { text: `${hours}h ${minutes}m remaining`, color: 'text-yellow-600' };
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
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

  const cutoffStatus = getCutoffStatus(batch.cutoffAt);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/admin/batches" className="text-sm text-mandi-muted hover:text-mandi-green">
          &larr; Back to Batches
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-mandi-dark">{batch.name}</h1>
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${STATUS_COLORS[batch.status]}`}
                >
                  {batch.status}
                </span>
              </div>
              {batch.hub && <p className="text-mandi-muted mt-1">Hub: {batch.hub.name}</p>}
            </div>
            {batch.status === 'DRAFT' && (
              <Link to={`/admin/batches/${batch.id}/edit`}>
                <Button variant="outline">Edit Batch</Button>
              </Link>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-mandi-muted uppercase tracking-wider">Cutoff</p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {formatDateTime(batch.cutoffAt)}
              </p>
              <p className={`text-xs mt-1 ${cutoffStatus.color}`}>{cutoffStatus.text}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-mandi-muted uppercase tracking-wider">Delivery Date</p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {formatDate(batch.deliveryDate)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-mandi-muted uppercase tracking-wider">Created</p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {formatDate(batch.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {batch.allowedTransitions.length > 0 && (
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">State Transitions</h3>
            <div className="flex gap-3">
              {batch.allowedTransitions.map((nextStatus) => (
                <Button
                  key={nextStatus}
                  onClick={() => handleTransition(nextStatus as Batch['status'])}
                  disabled={transitioning}
                  variant={nextStatus === 'OPEN' ? 'default' : 'outline'}
                >
                  {transitioning ? 'Transitioning...' : `Move to ${nextStatus}`}
                </Button>
              ))}
            </div>
            {batch.status === 'DRAFT' && (
              <p className="text-xs text-mandi-muted mt-2">
                Note: Once opened, the batch cannot be edited and orders can be placed.
              </p>
            )}
          </div>
        )}

        {batch.status === 'SETTLED' && (
          <div className="p-6 bg-green-50 border-t border-gray-200">
            <p className="text-green-700 font-medium">
              This batch has been settled. All orders have been fulfilled and payments processed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
