import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Define the shape of the stats data
export interface PublicStats {
  farmers: number;
  products: number;
  regions: number;
  generatedAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export function usePublicStats() {
  return useQuery({
    queryKey: ['public-stats'],
    queryFn: async (): Promise<PublicStats> => {
      const { data } = await axios.get(`${API_URL}/api/stats`);
      return data;
    },
    // Cache for 1 hour on client side to match server cache
    staleTime: 60 * 60 * 1000,
    // Keep data in cache for 2 hours
    gcTime: 2 * 60 * 60 * 1000,
    retry: 1,
  });
}
