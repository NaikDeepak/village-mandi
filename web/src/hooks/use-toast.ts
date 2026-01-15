// Simplified mock toast hook for now

import { useCallback } from 'react';

export function useToast() {
  const toast = useCallback(
    ({
      title,
      description,
      variant,
    }: { title: string; description?: string; variant?: string }) => {
      // In a real app, this would trigger a UI notification
      // For now, we'll just ignore it or could use a custom event
      void title;
      void description;
      void variant;
    },
    []
  );

  return { toast };
}
