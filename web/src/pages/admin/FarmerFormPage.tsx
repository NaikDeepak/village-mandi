import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { farmersApi } from '@/lib/api';
import type { CreateFarmerInput } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

const RELATIONSHIP_LEVELS = ['SELF', 'FAMILY', 'FRIEND', 'REFERRED'];

export function FarmerFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateFarmerInput>();

  const fetchFarmer = useCallback(
    async (farmerId: string) => {
      try {
        setLoading(true);
        const res = await farmersApi.getById(farmerId);
        if (res.error || !res.data) throw new Error(res.error || 'Failed to fetch farmer');

        const { farmer } = res.data;
        setValue('name', farmer.name);
        setValue('location', farmer.location);
        setValue('description', farmer.description || '');
        setValue('relationshipLevel', farmer.relationshipLevel);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch farmer details');
      } finally {
        setLoading(false);
      }
    },
    [setValue]
  );

  useEffect(() => {
    if (id) {
      fetchFarmer(id);
    }
  }, [id, fetchFarmer]);

  const onSubmit = async (data: CreateFarmerInput) => {
    try {
      setLoading(true);
      if (id) {
        const res = await farmersApi.update(id, data);
        if (res.error) throw new Error(res.error);
      } else {
        const res = await farmersApi.create(data);
        if (res.error) throw new Error(res.error);
      }
      navigate('/admin/farmers');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save farmer');
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-mandi-dark mb-6">
        {id ? 'Edit Farmer' : 'Add New Farmer'}
      </h1>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register('name', { required: 'Name is required' })} />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...register('location', { required: 'Location is required' })} />
          {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="relationshipLevel">Relationship Level</Label>
          <select
            id="relationshipLevel"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            {...register('relationshipLevel', { required: 'Relationship level is required' })}
          >
            <option value="">Select Level</option>
            {RELATIONSHIP_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          {errors.relationshipLevel && (
            <p className="text-sm text-red-500">{errors.relationshipLevel.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <textarea
            id="description"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            {...register('description')}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/farmers')}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Farmer'}
          </Button>
        </div>
      </form>
    </div>
  );
}
