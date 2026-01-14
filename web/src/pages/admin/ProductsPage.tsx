import { Button } from '@/components/ui/button';
import { farmersApi, productsApi } from '@/lib/api';
import type { Farmer, Product } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [selectedFarmer, setSelectedFarmer] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await productsApi.getAll({
        includeInactive: true,
        farmerId: selectedFarmer || undefined,
      });
      if (res.error) throw new Error(res.error);
      setProducts(res.data?.products || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [selectedFarmer]);

  const fetchInitialData = useCallback(async () => {
    try {
      const farmersRes = await farmersApi.getAll();
      setFarmers(farmersRes.data?.farmers || []);
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const toggleStatus = async (product: Product) => {
    if (
      !confirm(
        `Are you sure you want to ${product.isActive ? 'deactivate' : 'activate'} this product?`
      )
    )
      return;

    try {
      let res: { error?: string } | undefined;
      if (product.isActive) {
        res = await productsApi.delete(product.id);
      } else {
        res = await productsApi.update(product.id, { isActive: true });
      }

      if (res.error) throw new Error(res.error);
      fetchProducts();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-mandi-dark">Products</h1>
          <select
            value={selectedFarmer}
            onChange={(e) => setSelectedFarmer(e.target.value)}
            className="rounded-md border border-gray-300 py-1 pl-3 pr-8 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Farmers</option>
            {farmers.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
        <Link to="/admin/products/new">
          <Button>Add Product</Button>
        </Link>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded mb-4">{error}</div>}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Farmer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Season
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.farmer?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.seasonStart
                      ? new Date(product.seasonStart).toLocaleDateString()
                      : 'N/A'}{' '}
                    -{product.seasonEnd ? new Date(product.seasonEnd).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/admin/products/${product.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggleStatus(product)}
                      className="text-red-600 hover:text-red-900"
                    >
                      {product.isActive ? 'Deactivate' : 'Activate'}
                    </button>
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
