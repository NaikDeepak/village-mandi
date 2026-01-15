import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { batchProductsApi, productsApi } from '@/lib/api';
import type { AddBatchProductInput, BatchProduct, Product } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z
  .object({
    productId: z.string().min(1, 'Product is required'),
    pricePerUnit: z.coerce.number().positive('Price must be positive'),
    facilitationPercent: z.coerce.number().min(0, 'Min 0%').max(100, 'Max 100%'),
    minOrderQty: z.coerce.number().positive('Min order quantity must be positive'),
    maxOrderQty: z.preprocess(
      // Convert empty string to null, otherwise coerce to number
      (val) => (val === '' || val === null || val === undefined ? null : Number(val)),
      z.number().positive('Max order quantity must be positive').nullable()
    ),
  })
  .refine(
    (data) => {
      // If maxOrderQty is set, it must be >= minOrderQty
      if (data.maxOrderQty !== null && data.maxOrderQty < data.minOrderQty) {
        return false;
      }
      return true;
    },
    {
      message: 'Max order quantity cannot be less than min order quantity',
      path: ['maxOrderQty'],
    }
  );

type FormValues = z.infer<typeof schema>;

interface Props {
  batchId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  existingProduct?: BatchProduct | null;
  alreadyAddedProductIds: string[];
}

export function AddProductToBatchModal({
  batchId,
  isOpen,
  onClose,
  onSuccess,
  existingProduct,
  alreadyAddedProductIds,
}: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    // biome-ignore lint/suspicious/noExplicitAny: Fix zodResolver type mismatch with react-hook-form
    resolver: zodResolver(schema) as any,
    defaultValues: {
      productId: '',
      pricePerUnit: 0,
      facilitationPercent: 5,
      minOrderQty: 1,
      maxOrderQty: null,
    },
  });

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
      if (existingProduct) {
        reset({
          productId: existingProduct.productId,
          pricePerUnit: existingProduct.pricePerUnit,
          facilitationPercent: existingProduct.facilitationPercent,
          minOrderQty: existingProduct.minOrderQty,
          maxOrderQty: existingProduct.maxOrderQty,
        });
      } else {
        reset({
          productId: '',
          pricePerUnit: 0,
          facilitationPercent: 5,
          minOrderQty: 1,
          maxOrderQty: null,
        });
      }
    }
  }, [isOpen, existingProduct, reset]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productsApi.getAll({ includeInactive: false });
      if (res.error) throw new Error(res.error);
      setProducts(res.data?.products || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setError('');

      // Build payload
      // We explicitly pass maxOrderQty (even if null) to ensure it gets updated/cleared in the backend
      const payload = data;

      if (existingProduct) {
        const { productId: _, ...updateData } = payload;
        const res = await batchProductsApi.update(existingProduct.id, updateData);
        if (res.error) throw new Error(res.error);
      } else {
        const res = await batchProductsApi.add(batchId, payload as AddBatchProductInput);
        if (res.error) throw new Error(res.error);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save batch product');
    }
  };

  if (!isOpen) return null;

  const availableProducts = products.filter(
    (p) =>
      !alreadyAddedProductIds.includes(p.id) ||
      (existingProduct && p.id === existingProduct.productId)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-mandi-dark">
            {existingProduct ? 'Edit Batch Product' : 'Add Product to Batch'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm">{error}</div>}

          <div className="space-y-1">
            <Label htmlFor="productId">Product</Label>
            <select
              id="productId"
              disabled={!!existingProduct || loading}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              {...register('productId')}
            >
              <option value="">Select a product</option>
              {availableProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.farmer?.name || 'Unknown farmer'})
                </option>
              ))}
            </select>
            {errors.productId && <p className="text-xs text-red-500">{errors.productId.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="pricePerUnit">Price per Unit (₹)</Label>
              <Input id="pricePerUnit" type="number" step="0.01" {...register('pricePerUnit')} />
              {errors.pricePerUnit && (
                <p className="text-xs text-red-500">{errors.pricePerUnit.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="facilitationPercent">Facilitation Fee (%)</Label>
              <Input
                id="facilitationPercent"
                type="number"
                step="0.1"
                {...register('facilitationPercent')}
              />
              {errors.facilitationPercent && (
                <p className="text-xs text-red-500">{errors.facilitationPercent.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="minOrderQty">Min Order Qty</Label>
              <Input id="minOrderQty" type="number" {...register('minOrderQty')} />
              {errors.minOrderQty && (
                <p className="text-xs text-red-500">{errors.minOrderQty.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="maxOrderQty">Max Order Qty (Optional)</Label>
              <Input
                id="maxOrderQty"
                type="number"
                {...register('maxOrderQty')}
                placeholder="No limit"
              />
              {errors.maxOrderQty && (
                <p className="text-xs text-red-500">{errors.maxOrderQty.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || loading}>
              {isSubmitting ? 'Saving...' : existingProduct ? 'Update Product' : 'Add to Batch'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
