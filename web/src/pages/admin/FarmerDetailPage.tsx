import { Button } from '@/components/ui/button';
import { farmersApi } from '@/lib/api';
import type { Farmer } from '@/types';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export function FarmerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchFarmer(id);
    }
  }, [id]);

  const fetchFarmer = async (farmerId: string) => {
    try {
      setLoading(true);
      const res = await farmersApi.getById(farmerId);
      if (res.error) throw new Error(res.error);
      setFarmer(res.data?.farmer || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch farmer');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error || !farmer) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded mb-4">{error || 'Farmer not found'}</div>
        <Link to="/admin/farmers">
          <Button variant="outline">&larr; Back to Farmers</Button>
        </Link>
      </div>
    );
  }

  const products = farmer.products || [];
  const activeProducts = products.filter((p) => p.isActive);
  const inactiveProducts = products.filter((p) => !p.isActive);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/admin/farmers" className="text-sm text-mandi-muted hover:text-mandi-green">
          &larr; Back to Farmers
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-mandi-dark">{farmer.name}</h1>
                <span
                  className={`px-2 py-0.5 text-xs font-semibold rounded-full ${farmer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                >
                  {farmer.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-mandi-muted mt-1">{farmer.location}</p>
            </div>
            <Link to={`/admin/farmers/${farmer.id}/edit`}>
              <Button variant="outline">Edit Farmer</Button>
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-mandi-muted uppercase tracking-wider">Relationship</p>
              <p className="text-sm font-medium text-gray-900">{farmer.relationshipLevel}</p>
            </div>
            <div>
              <p className="text-xs text-mandi-muted uppercase tracking-wider">Total Products</p>
              <p className="text-sm font-medium text-gray-900">{products.length}</p>
            </div>
            <div>
              <p className="text-xs text-mandi-muted uppercase tracking-wider">Active Products</p>
              <p className="text-sm font-medium text-gray-900">{activeProducts.length}</p>
            </div>
          </div>

          {farmer.description && (
            <div className="mt-4">
              <p className="text-xs text-mandi-muted uppercase tracking-wider">Description</p>
              <p className="text-sm text-gray-700 mt-1">{farmer.description}</p>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-mandi-dark">Products</h2>
            <Link to={`/admin/products/new?farmerId=${farmer.id}`}>
              <Button size="sm">Add Product</Button>
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-8 text-mandi-muted">
              <p>No products yet.</p>
              <Link
                to={`/admin/products/new?farmerId=${farmer.id}`}
                className="text-mandi-green hover:underline text-sm mt-2 inline-block"
              >
                Add the first product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Season
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        {product.description && (
                          <div className="text-xs text-gray-500 truncate max-w-xs">
                            {product.description}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {product.unit}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {product.seasonStart && product.seasonEnd
                          ? `${product.seasonStart} - ${product.seasonEnd}`
                          : product.seasonStart || product.seasonEnd || 'Year-round'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                        >
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {inactiveProducts.length > 0 && activeProducts.length > 0 && (
            <p className="text-xs text-mandi-muted mt-4">
              {inactiveProducts.length} inactive product
              {inactiveProducts.length > 1 ? 's' : ''} shown above
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
