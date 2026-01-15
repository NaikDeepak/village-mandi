import { AddProductToBatchModal } from '@/components/admin/AddProductToBatchModal';
import { Button } from '@/components/ui/button';
import { batchProductsApi, batchesApi } from '@/lib/api';
import type { Batch, BatchProduct } from '@/types';
import { Edit2, ListChecks, Plus, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
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
  const [batchProducts, setBatchProducts] = useState<BatchProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState('');
  const [transitioning, setTransitioning] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<BatchProduct | null>(null);

  const fetchBatch = useCallback(async (batchId: string) => {
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
  }, []);

  const fetchBatchProducts = useCallback(async (batchId: string) => {
    try {
      setProductsLoading(true);
      const res = await batchProductsApi.getByBatch(batchId);
      if (res.error) throw new Error(res.error);
      setBatchProducts(res.data?.products || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchBatch(id);
      fetchBatchProducts(id);
    }
  }, [id, fetchBatch, fetchBatchProducts]);

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

  const handleRemoveProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to remove this product from the batch?')) {
      return;
    }

    try {
      const res = await batchProductsApi.remove(productId, true); // Hard delete for now in admin UI
      if (res.error) throw new Error(res.error);
      if (id) fetchBatchProducts(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to remove product');
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
  const isDraft = batch.status === 'DRAFT';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-center">
        <Link to="/admin/batches" className="text-sm text-mandi-muted hover:text-mandi-green">
          &larr; Back to Batches
        </Link>
      </div>

      <div className="space-y-6">
        {/* Batch Overview Card */}
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
              <div className="flex gap-2">
                {batch.status !== 'DRAFT' && (
                  <Link to={`/admin/batches/${batch.id}/procurement`}>
                    <Button variant="outline" className="flex items-center gap-2">
                      <ListChecks size={16} /> Procurement List
                    </Button>
                  </Link>
                )}
                {isDraft && (
                  <Link to={`/admin/batches/${batch.id}/edit`}>
                    <Button variant="outline">Edit Batch Info</Button>
                  </Link>
                )}
              </div>
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
              {isDraft && (
                <p className="text-xs text-mandi-muted mt-2">
                  Note: Once opened, the batch cannot be edited and orders can be placed.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-mandi-dark">Products in this Batch</h2>
              <p className="text-sm text-mandi-muted">Manage pricing and scoping for this batch</p>
            </div>
            {isDraft && (
              <Button
                onClick={() => {
                  setEditingProduct(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2"
              >
                <Plus size={16} /> Add Product
              </Button>
            )}
          </div>

          {!isDraft && (
            <div className="bg-yellow-50 px-6 py-3 border-b border-yellow-100 text-yellow-800 text-sm">
              Product pricing and inclusion is locked for {batch.status} batches.
            </div>
          )}

          <div className="overflow-x-auto">
            {productsLoading && batchProducts.length === 0 ? (
              <div className="p-8 text-center text-mandi-muted">Loading products...</div>
            ) : batchProducts.length === 0 ? (
              <div className="p-8 text-center text-mandi-muted">
                No products added yet. Add products to this batch to set pricing.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product & Farmer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price/Unit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Facilitation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      MOQ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Max Qty
                    </th>
                    {isDraft && (
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {batchProducts.map((bp) => (
                    <tr key={bp.id} className={!bp.isActive ? 'opacity-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{bp.product.name}</div>
                        <div className="text-sm text-mandi-muted">{bp.product.farmer?.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{bp.pricePerUnit.toFixed(2)} / {bp.product.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bp.facilitationPercent}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bp.minOrderQty} {bp.product.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bp.maxOrderQty ? `${bp.maxOrderQty} ${bp.product.unit}` : 'No limit'}
                      </td>
                      {isDraft && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProduct(bp);
                                setIsModalOpen(true);
                              }}
                              className="text-mandi-green hover:text-green-700"
                              title="Edit Pricing"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveProduct(bp.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Remove Product"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {id && (
        <AddProductToBatchModal
          batchId={id}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
          onSuccess={() => fetchBatchProducts(id)}
          existingProduct={editingProduct}
          alreadyAddedProductIds={batchProducts.map((bp) => bp.productId)}
        />
      )}
    </div>
  );
}
