import { MapPin, Package, Wheat } from 'lucide-react';
import { usePublicStats } from '../../hooks/useStats';

// Fallback values if API fails or is loading
const DEFAULT_STATS = {
  farmers: 5,
  products: 10,
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
      description: 'Mango, Rice, Jaggery, Tur Dal, Jowar',
    },
    {
      label: 'Sourcing Regions',
      value: `${displayStats.regions}+`,
      icon: MapPin,
      description: 'Maharashtra',
    },
  ];

  return (
    <div className="py-24 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {statItems.map((stat) => (
            <div key={stat.label} className="text-center group pt-8 md:pt-0">
              <div className="mb-4 inline-flex items-center justify-center p-3 rounded-full bg-mandi-cream group-hover:bg-mandi-green/10 transition-colors duration-300">
                <stat.icon className="h-6 w-6 text-mandi-green opacity-80" aria-hidden="true" />
              </div>

              <div className="text-5xl md:text-6xl font-serif font-bold text-mandi-dark mb-3 tracking-tight">
                {isLoading ? (
                  <span className="animate-pulse bg-gray-100 text-transparent rounded">--</span>
                ) : (
                  stat.value
                )}
              </div>

              <div className="text-sm font-bold text-mandi-earth-light uppercase tracking-widest mb-2">
                {stat.label}
              </div>

              <div className="text-base text-mandi-muted max-w-[200px] mx-auto">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
