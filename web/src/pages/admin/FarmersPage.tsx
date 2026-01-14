import { Button } from '@/components/ui/button';
import { farmersApi } from '@/lib/api';
import type { Farmer } from '@/types';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export function FarmersPage() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      setLoading(true);
      const res = await farmersApi.getAll(true); // Include inactive
      if (res.error) throw new Error(res.error);
      setFarmers(res.data?.farmers || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch farmers');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (farmer: Farmer) => {
    if (
      !confirm(
        `Are you sure you want to ${farmer.isActive ? 'deactivate' : 'activate'} this farmer?`
      )
    )
      return;

    try {
      // If deactivating, we use delete (soft delete). If activating, we use update.
      // Ideally, the backend delete is a soft delete (isActive=false).
      // For re-activating, we need update.
      let res: { error?: string } | undefined;
      if (farmer.isActive) {
        res = await farmersApi.delete(farmer.id);
      } else {
        res = await farmersApi.update(farmer.id, { isActive: true });
      }

      if (res.error) throw new Error(res.error);
      fetchFarmers(); // Refresh list
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-mandi-dark">Farmers</h1>
        <Link to="/admin/farmers/new">
          <Button>Add Farmer</Button>
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
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Relationship
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
            {farmers.map((farmer) => (
              <tr key={farmer.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link to={`/admin/farmers/${farmer.id}`} className="hover:underline">
                    <div className="text-sm font-medium text-gray-900">{farmer.name}</div>
                    <div className="text-sm text-gray-500">
                      {farmer._count?.products || 0} products
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {farmer.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {farmer.relationshipLevel}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${farmer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {farmer.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    to={`/admin/farmers/${farmer.id}/edit`}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleStatus(farmer)}
                    className="text-red-600 hover:text-red-900"
                  >
                    {farmer.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
