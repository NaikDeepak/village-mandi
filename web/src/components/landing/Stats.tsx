import { usePublicStats } from '../../hooks/useStats';

const DEFAULT_STATS = {
  farmers: 0,
  products: 0,
  regions: 0,
};

export function Stats() {
  const { data: serverStats, isLoading } = usePublicStats();

  const displayStats = {
    farmers: serverStats?.farmers ?? DEFAULT_STATS.farmers,
    products: serverStats?.products ?? DEFAULT_STATS.products,
    regions: serverStats?.regions ?? DEFAULT_STATS.regions,
  };

  const statItems = [
    {
      label: 'Partner Farmers',
      value: `${displayStats.farmers}+`,
      // icon removed for minimalism, focusing on typography
      description: 'Families supported directly',
    },
    {
      label: 'Products',
      value: `${displayStats.products}`,
      description: 'Varieties of indigenous produce',
    },
    {
      label: 'Villages',
      value: `${displayStats.regions}+`,
      description: 'Across Konkan & Western Ghats',
    },
  ];

  return (
    <section className="py-24 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-12 md:gap-8">

          {/* Context Heading */}
          <div className="md:w-1/4">
            <h3 className="text-sm font-bold tracking-[0.2em] text-mandi-green uppercase mb-2">Impact</h3>
            <p className="font-serif text-2xl text-mandi-dark leading-tight">
              Our growing footprint.
            </p>
          </div>

          {/* Stats Grid - Cleaner, Horizontal */}
          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {statItems.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center md:items-start group cursor-default">
                <div className="text-6xl font-serif font-medium text-mandi-dark mb-2 tracking-tighter group-hover:text-mandi-green transition-colors duration-300">
                  {isLoading ? (
                    <span className="animate-pulse bg-gray-100 text-transparent rounded">--</span>
                  ) : (
                    stat.value
                  )}
                </div>
                <div className="text-xs font-bold text-mandi-earth-light uppercase tracking-widest mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-mandi-muted font-light">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
