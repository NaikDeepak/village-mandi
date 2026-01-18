import { prisma } from '../../db';
import { statsCache } from '../utils/cache';

const CACHE_KEY = 'landing_page_stats';

export async function getLandingPageStats() {
  // 1. Try to get from cache
  const cached = statsCache.get(CACHE_KEY);
  if (cached) {
    return cached;
  }

  // 2. If not active, fetch parallel queries from DB
  const [activeFarmersCount, activeProductsCount, regions] = await Promise.all([
    // Active Farmers
    prisma.farmer.count({
      where: { isActive: true },
    }),

    // Products (approximate unique count or total products)
    // Counting total active products available in the system
    prisma.product.count({
      where: { isActive: true },
    }),

    // Sourcing Regions (distinct locations from active farmers)
    prisma.farmer.findMany({
      where: { isActive: true },
      select: { location: true },
      distinct: ['location'],
    }),
  ]);

  const stats = {
    farmers: activeFarmersCount,
    products: activeProductsCount,
    regions: regions.length,
    // Add a timestamp so frontend knows when data was fetched
    generatedAt: new Date().toISOString(),
  };

  // 3. Set cache
  statsCache.set(CACHE_KEY, stats);

  return stats;
}
