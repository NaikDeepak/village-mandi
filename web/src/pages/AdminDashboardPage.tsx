export function AdminDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-mandi-dark mb-4">Dashboard</h2>
        <p className="text-mandi-muted">
          Welcome to the Virtual Mandi admin panel. This is a placeholder page.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-mandi-cream rounded-lg p-6">
            <h3 className="font-semibold text-mandi-dark">Batches</h3>
            <p className="text-3xl font-bold text-mandi-green mt-2">5</p>
            <p className="text-sm text-mandi-muted mt-1">Total batches</p>
          </div>
          <div className="bg-mandi-cream rounded-lg p-6">
            <h3 className="font-semibold text-mandi-dark">Orders</h3>
            <p className="text-3xl font-bold text-mandi-green mt-2">2</p>
            <p className="text-sm text-mandi-muted mt-1">Active orders</p>
          </div>
          <div className="bg-mandi-cream rounded-lg p-6">
            <h3 className="font-semibold text-mandi-dark">Farmers</h3>
            <p className="text-3xl font-bold text-mandi-green mt-2">5</p>
            <p className="text-sm text-mandi-muted mt-1">Registered farmers</p>
          </div>
        </div>
      </div>
    </div>
  );
}
