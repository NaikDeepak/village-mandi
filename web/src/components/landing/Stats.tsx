import { MapPin, Package, Wheat } from 'lucide-react';
import { usePublicStats } from '../../hooks/useStats';

// Fallback values if API fails or is loading
const DEFAULT_STATS = {
  farmers: 12,
  products: 8,
  regions: 2,
};

export function Stats() {
  const { data: serverStats, isLoading } = usePublicStats();

  // Use server data if available, otherwise default
  const displayStats = {
    farmers: serverStats?.farmers ?? DEFAULT_STATS.farmers,
    products: serverStats?.products ?? DEFAULT_STATS.products,
    regions: serverStats?.regions ?? DEFAULT_STATS.regions,
  };

  const statItems = [
    {
      label: 'Partner Farmers',
      value: `${displayStats.farmers}+`,
      icon: Wheat,
      description: 'Trusted farmers from known villages',
    },
    {
      label: 'Products Available',
      value: `${displayStats.products}`, // Exact count
      icon: Package,
      description: 'Mango, Rice, Jaggery, Tur Dal, Jowar, Supari',
    },
    {
      label: 'Sourcing Regions',
      value: `${displayStats.regions}+`,
      icon: MapPin,
      description: 'Karnataka & Maharashtra',
    },
  ];

  return (
    <div className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statItems.map((stat) => (
            <div
              key={stat.label}
              className="text-center group p-6 rounded-2xl hover:bg-gray-50 transition-colors duration-300"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-mandi-cream group-hover:bg-mandi-green/10 transition-colors duration-300 mb-4 shadow-sm">
                <stat.icon className="h-7 w-7 text-mandi-green" aria-hidden="true" />
              </div>
              <div className="text-4xl font-bold text-mandi-dark mb-2 tracking-tight">
                {isLoading ? (
                  <span className="animate-pulse bg-gray-200 text-transparent rounded">00</span>
                ) : (
                  stat.value
                )}
              </div>
              <div className="text-sm font-semibold text-mandi-green uppercase tracking-wide mb-2 opacity-80">
                {stat.label}
              </div>
              <div className="text-sm text-gray-500 font-medium">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
