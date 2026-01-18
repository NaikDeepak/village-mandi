import { cn } from '@/lib/utils';
import type { Order } from '@/types';
import { CheckCircle2, Circle, Package, Truck, Wallet } from 'lucide-react';

interface OrderStatusBarProps {
  status: Order['status'];
}

const STAGES = [
  { key: 'PLACED', label: 'Placed', icon: CheckCircle2 },
  { key: 'COMMITMENT_PAID', label: 'Advance Paid', icon: Wallet },
  { key: 'FULLY_PAID', label: 'Fully Paid', icon: CheckCircle2 },
  { key: 'PACKED', label: 'Packed', icon: Package },
  { key: 'DISTRIBUTED', label: 'Distributed', icon: Truck },
];

export function OrderStatusBar({ status }: OrderStatusBarProps) {
  if (status === 'CANCELLED') {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm font-medium">
        This order has been cancelled.
      </div>
    );
  }

  // Find index of current status
  const currentIndex = STAGES.findIndex((s) => s.key === status);

  return (
    <div className="w-full py-6">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-mandi-green -translate-y-1/2 transition-all duration-500"
          style={{ width: `${(Math.max(0, currentIndex) / (STAGES.length - 1)) * 100}%` }}
        />

        {/* Stages */}
        <div className="relative flex justify-between">
          {STAGES.map((stage, index) => {
            const Icon = stage.icon;
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isFuture = index > currentIndex;

            return (
              <div key={stage.key} className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center bg-white border-2 z-10',
                    isCompleted && 'bg-mandi-green border-mandi-green text-white',
                    isCurrent && 'border-mandi-green text-mandi-green',
                    isFuture && 'border-gray-300 text-gray-300'
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 size={18} />
                  ) : isCurrent ? (
                    <Icon size={18} className="animate-pulse" />
                  ) : (
                    <Circle size={10} fill="currentColor" />
                  )}
                </div>
                <span
                  className={cn(
                    'text-[10px] sm:text-xs mt-2 font-medium text-center max-w-[60px] sm:max-w-none',
                    isCurrent ? 'text-mandi-green font-bold' : 'text-mandi-muted'
                  )}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
