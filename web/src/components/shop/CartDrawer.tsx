import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cart';
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getTotalAmount, getTotalItems } = useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        role="button"
        tabIndex={-1}
        aria-label="Close cart"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-4 border-b flex items-center justify-between bg-mandi-cream/30">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-mandi-green" />
            <h2 className="text-lg font-bold text-mandi-dark">Your Cart</h2>
            <span className="bg-mandi-green text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {getTotalItems()}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="bg-mandi-cream p-4 rounded-full mb-4">
                <ShoppingCart className="h-8 w-8 text-mandi-muted" />
              </div>
              <p className="text-mandi-dark font-medium">Your cart is empty</p>
              <p className="text-mandi-muted text-sm mt-1">
                Add some fresh produce from the Mandi!
              </p>
              <Button variant="outline" className="mt-6" onClick={onClose}>
                Browse Products
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.batchProductId}
                className="flex gap-3 bg-white border border-mandi-muted/10 p-3 rounded-lg shadow-sm"
              >
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <h4 className="font-bold text-mandi-dark text-sm">{item.name}</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-mandi-muted hover:text-red-500"
                      onClick={() => removeItem(item.batchProductId)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <p className="text-[10px] text-mandi-muted mb-2">from {item.farmerName}</p>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center border rounded-md bg-mandi-cream/20">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-none"
                        onClick={() => updateQuantity(item.batchProductId, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-none"
                        onClick={() => updateQuantity(item.batchProductId, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-mandi-green">
                        ₹
                        {(
                          item.pricePerUnit *
                          (1 + item.facilitationPercent / 100) *
                          item.quantity
                        ).toFixed(2)}
                      </p>
                      <p className="text-[9px] text-mandi-muted">
                        ₹{(item.pricePerUnit * (1 + item.facilitationPercent / 100)).toFixed(2)} /{' '}
                        {item.unit}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t bg-mandi-cream/10 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-mandi-muted">Subtotal</span>
                <span className="text-mandi-dark">₹{getTotalAmount().toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-mandi-dark">Estimated Total</span>
                <span className="text-xl font-bold text-mandi-green">
                  ₹{getTotalAmount().toFixed(2)}
                </span>
              </div>
              <p className="text-[10px] text-mandi-muted text-center italic">
                Final total may vary slightly based on actual procurement weight.
              </p>
            </div>

            <Button
              className="w-full h-12 text-lg font-bold gap-2"
              onClick={() => {
                onClose();
                navigate('/shop/checkout');
              }}
            >
              Proceed to Checkout <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
