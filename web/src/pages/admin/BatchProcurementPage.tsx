import { Button } from '@/components/ui/button';
import { batchesApi } from '@/lib/api';
import type { Batch, BatchAggregationFarmer } from '@/types';
import { Copy, ExternalLink, Printer } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export function BatchProcurementPage() {
  const { id } = useParams<{ id: string }>();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [aggregation, setAggregation] = useState<BatchAggregationFarmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async (batchId: string) => {
    try {
      setLoading(true);
      const [batchRes, aggRes] = await Promise.all([
        batchesApi.getById(batchId),
        batchesApi.getAggregation(batchId),
      ]);

      if (batchRes.error) throw new Error(batchRes.error);
      if (aggRes.error) throw new Error(aggRes.error);

      setBatch(batchRes.data?.batch || null);
      setAggregation(aggRes.data?.aggregation || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch procurement data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id, fetchData]);

  const copyToWhatsApp = (farmer: BatchAggregationFarmer) => {
    const dateStr = batch ? new Date(batch.deliveryDate).toLocaleDateString('en-IN') : '';
    let text = `*Procurement List: ${batch?.name || 'Batch'}*\n`;
    text += `*Farmer:* ${farmer.farmerName}\n`;
    text += `*Location:* ${farmer.farmerLocation}\n`;
    text += `*Expected Delivery:* ${dateStr}\n\n`;
    text += 'Items to collect:\n';

    farmer.products.forEach((p) => {
      text += `- ${p.productName}: *${p.totalQuantity} ${p.unit}*\n`;
    });

    text += '\nPlease confirm if these are available.';

    navigator.clipboard.writeText(text);
    alert(`Copied WhatsApp message for ${farmer.farmerName} to clipboard!`);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="p-8 text-center text-mandi-muted">Loading procurement data...</div>;
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

  // Calculate total products needed across all farmers
  const totalItems = aggregation.reduce((acc, f) => acc + f.products.length, 0);

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
            <Printer size={16} /> Print List
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-8 print:shadow-none print:border">
        <div className="p-6 border-b border-gray-200 bg-mandi-cream/10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-mandi-dark">Procurement List</h1>
              <p className="text-mandi-muted mt-1">
                Batch: <span className="font-semibold text-mandi-dark">{batch.name}</span> |
                Delivery:{' '}
                <span className="font-semibold text-mandi-dark">
                  {new Date(batch.deliveryDate).toLocaleDateString('en-IN')}
                </span>
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <span className="text-sm text-mandi-muted block uppercase tracking-wider">
                Status
              </span>
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full mt-1 bg-blue-100 text-blue-800">
                {batch.status}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-50/50">
          <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
            <p className="text-xs text-mandi-muted uppercase tracking-wider">Farmers</p>
            <p className="text-xl font-bold text-mandi-dark">{aggregation.length}</p>
          </div>
          <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
            <p className="text-xs text-mandi-muted uppercase tracking-wider">Unique Products</p>
            <p className="text-xl font-bold text-mandi-dark">{totalItems}</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {aggregation.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-mandi-muted italic">No confirmed orders for this batch yet.</p>
            <p className="text-sm text-mandi-muted mt-2">
              Only orders with COMMITMENT_PAID or FULLY_PAID status are aggregated.
            </p>
          </div>
        ) : (
          aggregation.map((farmer) => (
            <div
              key={farmer.farmerId}
              className="bg-white rounded-lg shadow overflow-hidden print:shadow-none print:border break-inside-avoid"
            >
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <h3 className="text-lg font-bold text-mandi-dark flex items-center gap-2">
                    {farmer.farmerName}
                    <span className="text-xs font-normal text-mandi-muted bg-white px-2 py-0.5 rounded border">
                      {farmer.farmerLocation}
                    </span>
                  </h3>
                </div>
                <div className="flex gap-2 print:hidden">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 text-mandi-green border-mandi-green/30 hover:bg-mandi-green/10"
                    onClick={() => copyToWhatsApp(farmer)}
                  >
                    <Copy size={14} /> Copy for WhatsApp
                  </Button>
                  <Link to={`/admin/farmers/${farmer.farmerId}`} target="_blank">
                    <Button variant="ghost" size="sm" className="text-mandi-muted">
                      <ExternalLink size={14} />
                    </Button>
                  </Link>
                </div>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Target Qty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:table-cell hidden sm:table-cell">
                      Actual Procured
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {farmer.products.map((p) => (
                    <tr key={p.batchProductId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {p.productName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-mandi-dark">
                        {p.totalQuantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-mandi-muted">
                        {p.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 print:table-cell hidden sm:table-cell">
                        ________________
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
