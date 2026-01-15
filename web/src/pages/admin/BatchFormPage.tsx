import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { batchesApi, hubsApi } from '@/lib/api';
import type { CreateBatchInput, Hub } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

export function BatchFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [batchStatus, setBatchStatus] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateBatchInput>();

  // Fetch hubs
  useEffect(() => {
    const fetchHubs = async () => {
      try {
        const res = await hubsApi.getAll();
        if (res.error) throw new Error(res.error);
        setHubs(res.data?.hubs || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch hubs');
      }
    };
    fetchHubs();
  }, []);

  const fetchBatch = useCallback(
    async (batchId: string) => {
      try {
        setLoading(true);
        const res = await batchesApi.getById(batchId);
        if (res.error || !res.data) throw new Error(res.error || 'Failed to fetch batch');

        const { batch } = res.data;
        setBatchStatus(batch.status);

        // Only populate form if batch is DRAFT
        if (batch.status === 'DRAFT') {
          setValue('hubId', batch.hubId);
          setValue('name', batch.name);
          setValue('cutoffAt', new Date(batch.cutoffAt).toISOString().slice(0, 16));
          setValue('deliveryDate', new Date(batch.deliveryDate).toISOString().slice(0, 10));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch batch details');
      } finally {
        setLoading(false);
      }
    },
    [setValue]
  );

  useEffect(() => {
    if (id) {
      fetchBatch(id);
    }
  }, [id, fetchBatch]);

  const onSubmit = async (data: CreateBatchInput) => {
    try {
      setLoading(true);
      setError('');

      // Validate cutoff is in the future
      const cutoffDate = new Date(data.cutoffAt);
      if (cutoffDate <= new Date()) {
        setError('Cutoff date must be in the future');
        return;
      }

      // Validate delivery is after cutoff
      const deliveryDate = new Date(data.deliveryDate);
      if (deliveryDate <= cutoffDate) {
        setError('Delivery date must be after cutoff date');
        return;
      }

      if (id) {
        const res = await batchesApi.update(id, data);
        if (res.error) throw new Error(res.error);
      } else {
        const res = await batchesApi.create(data);
        if (res.error) throw new Error(res.error);
      }
      navigate('/admin/batches');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save batch');
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) return <div className="p-8">Loading...</div>;

  // Show read-only message if editing a non-DRAFT batch
  if (id && batchStatus && batchStatus !== 'DRAFT') {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-mandi-dark mb-6">Edit Batch</h1>
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-6 rounded-lg">
          <p className="font-semibold mb-2">Cannot Edit Batch</p>
          <p>Only DRAFT batches can be edited. This batch has status: {batchStatus}</p>
          <Button onClick={() => navigate('/admin/batches')} variant="outline" className="mt-4">
            Back to Batches
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-mandi-dark mb-6">
        {id ? 'Edit Batch' : 'Add New Batch'}
      </h1>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div className="space-y-2">
          <Label htmlFor="hubId">Hub</Label>
          <select
            id="hubId"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            {...register('hubId', { required: 'Hub is required' })}
          >
            <option value="">Select Hub</option>
            {hubs.map((hub) => (
              <option key={hub.id} value={hub.id}>
                {hub.name}
              </option>
            ))}
          </select>
          {errors.hubId && <p className="text-sm text-red-500">{errors.hubId.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Batch Name</Label>
          <Input
            id="name"
            {...register('name', {
              required: 'Name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' },
            })}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cutoffAt">Cutoff Date & Time</Label>
          <Input
            id="cutoffAt"
            type="datetime-local"
            {...register('cutoffAt', { required: 'Cutoff date is required' })}
          />
          {errors.cutoffAt && <p className="text-sm text-red-500">{errors.cutoffAt.message}</p>}
          <p className="text-xs text-gray-500">Orders accepted until this time</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="deliveryDate">Delivery Date</Label>
          <Input
            id="deliveryDate"
            type="date"
            {...register('deliveryDate', { required: 'Delivery date is required' })}
          />
          {errors.deliveryDate && (
            <p className="text-sm text-red-500">{errors.deliveryDate.message}</p>
          )}
          <p className="text-xs text-gray-500">Date when items will be delivered</p>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/batches')}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Batch'}
          </Button>
        </div>
      </form>
    </div>
  );
}
