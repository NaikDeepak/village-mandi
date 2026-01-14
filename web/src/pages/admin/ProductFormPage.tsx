import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { farmersApi, productsApi } from '@/lib/api';
import type { CreateProductInput, Farmer } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

const PRODUCT_UNITS = ['KG', 'LITRE', 'DOZEN', 'PIECE', 'BUNCH', 'BAG'];

export function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateProductInput>();

  const loadFarmers = useCallback(async () => {
    try {
      const res = await farmersApi.getAll();
      setFarmers(res.data?.farmers || []);
    } catch {
      // ignore
    }
  }, []);

  const fetchProduct = useCallback(
    async (productId: string) => {
      try {
        setLoading(true);
        const res = await productsApi.getById(productId);
        if (res.error || !res.data) throw new Error(res.error || 'Failed to fetch product');

        const { product } = res.data;
        setValue('name', product.name);
        setValue('farmerId', product.farmerId);
        setValue('unit', product.unit);
        setValue('description', product.description || '');
        setValue(
          'seasonStart',
          product.seasonStart ? new Date(product.seasonStart).toISOString().split('T')[0] : ''
        );
        setValue(
          'seasonEnd',
          product.seasonEnd ? new Date(product.seasonEnd).toISOString().split('T')[0] : ''
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    },
    [setValue]
  );

  useEffect(() => {
    loadFarmers();
    if (id) {
      fetchProduct(id);
    }
  }, [id, loadFarmers, fetchProduct]);

  const onSubmit = async (rawData: CreateProductInput) => {
    try {
      setLoading(true);

      // Convert dates to ISO format if present, remove if empty
      const data = { ...rawData };

      if (data.seasonStart) {
        data.seasonStart = new Date(data.seasonStart).toISOString();
      } else {
        // biome-ignore lint/performance/noDelete: explicitly removing empty strings
        delete data.seasonStart;
      }

      if (data.seasonEnd) {
        data.seasonEnd = new Date(data.seasonEnd).toISOString();
      } else {
        // biome-ignore lint/performance/noDelete: explicitly removing empty strings
        delete data.seasonEnd;
      }

      if (id) {
        const res = await productsApi.update(id, data);
        if (res.error) throw new Error(res.error);
      } else {
        const res = await productsApi.create(data);
        if (res.error) throw new Error(res.error);
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-mandi-dark mb-6">
        {id ? 'Edit Product' : 'Add New Product'}
      </h1>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div className="space-y-2">
          <Label htmlFor="farmerId">Farmer</Label>
          <select
            id="farmerId"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            {...register('farmerId', { required: 'Farmer is required' })}
            disabled={!!id} // Prevent changing farmer on edit if desired, or allow it
          >
            <option value="">Select Farmer</option>
            {farmers.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
          {errors.farmerId && <p className="text-sm text-red-500">{errors.farmerId.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" {...register('name', { required: 'Name is required' })} />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <select
            id="unit"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            {...register('unit', { required: 'Unit is required' })}
          >
            <option value="">Select Unit</option>
            {PRODUCT_UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
          {errors.unit && <p className="text-sm text-red-500">{errors.unit.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <textarea
            id="description"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            {...register('description')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="seasonStart">Season Start (Optional)</Label>
            <Input type="date" id="seasonStart" {...register('seasonStart')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seasonEnd">Season End (Optional)</Label>
            <Input type="date" id="seasonEnd" {...register('seasonEnd')} />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Product'}
          </Button>
        </div>
      </form>
    </div>
  );
}
