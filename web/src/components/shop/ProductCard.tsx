import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { BatchProduct } from '@/types';
import { Minus, Plus } from 'lucide-react';

interface ProductCardProps {
  batchProduct: BatchProduct;
  quantity: number;
  onQuantityChange: (qty: number) => void;
}

export function ProductCard({ batchProduct, quantity, onQuantityChange }: ProductCardProps) {
  const { product, pricePerUnit, facilitationPercent, minOrderQty, maxOrderQty } = batchProduct;

  const totalPrice = pricePerUnit * (1 + facilitationPercent / 100);

  const increment = () => {
    onQuantityChange(quantity + 1);
  };

  const decrement = () => {
    if (quantity > 0) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number.parseInt(e.target.value);
    if (!Number.isNaN(val)) {
      onQuantityChange(val);
    } else if (e.target.value === '') {
      onQuantityChange(0);
    }
  };

  const isValidQuantity =
    quantity === 0 || (quantity >= minOrderQty && (!maxOrderQty || quantity <= maxOrderQty));

  return (
    <Card className="flex flex-col h-full overflow-hidden border-mandi-muted/20">
      <CardHeader className="p-4 bg-mandi-cream/50">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold text-mandi-dark">{product.name}</CardTitle>
          <span className="text-xs font-medium bg-mandi-earth/10 text-mandi-earth px-2 py-0.5 rounded">
            {product.unit}
          </span>
        </div>
        <p className="text-xs text-mandi-muted">from {product.farmer?.name}</p>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        {product.description && (
          <p className="text-sm text-mandi-dark/80 line-clamp-2 mb-4">{product.description}</p>
        )}
        <div className="flex justify-between items-end mt-2">
          <div>
            <p className="text-2xl font-bold text-mandi-green">₹{totalPrice.toFixed(2)}</p>
            <p className="text-[10px] text-mandi-muted">incl. facilitation fee</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-mandi-muted">
              MOQ: {minOrderQty} {product.unit}
            </p>
            {maxOrderQty && (
              <p className="text-xs text-mandi-muted">
                Max: {maxOrderQty} {product.unit}
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t border-mandi-muted/10 bg-mandi-cream/20">
        <div className="flex flex-col w-full gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center border rounded-md overflow-hidden bg-white">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none border-r"
                onClick={decrement}
                disabled={quantity === 0}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Input
                type="number"
                value={quantity === 0 ? '' : quantity}
                onChange={handleInputChange}
                className="h-8 w-12 border-none text-center p-0 focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none border-l"
                onClick={increment}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            {quantity > 0 && (
              <p className="text-sm font-semibold text-mandi-dark">
                Total: ₹{(totalPrice * quantity).toFixed(2)}
              </p>
            )}
          </div>
          {!isValidQuantity && quantity > 0 && (
            <p className="text-[10px] text-red-500 font-medium">
              {quantity < minOrderQty
                ? `Min order is ${minOrderQty} ${product.unit}`
                : `Max order is ${maxOrderQty} ${product.unit}`}
            </p>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
