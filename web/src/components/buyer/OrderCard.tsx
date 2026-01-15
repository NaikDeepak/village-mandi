import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { logsApi } from '@/lib/api';
import { getWhatsAppLink, templates } from '@/lib/communication';
import { useAuthStore } from '@/stores/auth';
import type { Order } from '@/types';
import { format } from 'date-fns';
import { Calendar, MapPin, MessageCircle, Pencil, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { OrderStatusBar } from './OrderStatusBar';

interface OrderCardProps {
  order: Order;
  isActive?: boolean;
}

export function OrderCard({ order, isActive = false }: OrderCardProps) {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const totalPaid = order.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
  const balance = order.estimatedTotal - totalPaid;

  const isEditable =
    order.status === 'PLACED' &&
    order.batch?.status === 'OPEN' &&
    new Date(order.batch.cutoffAt) > new Date();

  const handleSupport = async () => {
    if (!user) return;

    const message = templates.supportRequest(user.name);
    // Open WhatsApp with blank phone (choose contact) or predefined hub manager if we had it
    const link = getWhatsAppLink('', message);
    window.open(link, '_blank');

    // Log the support request
    try {
      await logsApi.logCommunication({
        entityType: 'ORDER',
        entityId: order.id,
        messageType: 'SUPPORT_REQUEST',
        recipientPhone: 'HUB_MANAGER',
        metadata: { orderId: order.id },
      });
    } catch (error) {
      console.error('Failed to log communication:', error);
    }
  };

  return (
    <Card
      className={isActive ? 'border-mandi-green ring-1 ring-mandi-green/20 shadow-lg' : 'shadow-sm'}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingBag className="text-mandi-green" size={20} />
              {order.batch?.name || 'Order'}
            </CardTitle>
            <div className="flex flex-col gap-1 mt-1">
              <div className="flex items-center gap-1.5 text-sm text-mandi-muted">
                <Calendar size={14} />
                <span>
                  Delivery:{' '}
                  {order.batch ? format(new Date(order.batch.deliveryDate), 'PPP') : 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-mandi-muted">
                <MapPin size={14} />
                <span>{order.batch?.hub?.name || 'Local Hub'}</span>
              </div>
            </div>
          </div>
          <div className="text-right flex flex-col items-end gap-2">
            <div>
              <p className="text-xs text-mandi-muted uppercase tracking-wider font-semibold">
                Total Amount
              </p>
              <p className="text-xl font-bold text-mandi-dark">
                {formatCurrency(order.estimatedTotal)}
              </p>
            </div>
            {isEditable && (
              <div className="flex flex-col items-end gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/orders/${order.id}/edit`)}
                  className="h-8 border-mandi-green text-mandi-green hover:bg-mandi-green/5 font-semibold"
                >
                  <Pencil size={14} className="mr-1.5" />
                  Edit
                </Button>
                <p className="text-[10px] text-mandi-muted">
                  Edit until {format(new Date(order.batch!.cutoffAt), 'h:mm a, d MMM')}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Status Bar */}
        <div className="border-t border-b border-gray-50 py-2">
          <OrderStatusBar status={order.status} />
        </div>

        {/* Items List */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-semibold text-mandi-dark flex items-center gap-2">
              Items ({order.items?.length || 0})
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSupport}
              className="h-7 text-[10px] text-mandi-green hover:text-mandi-green hover:bg-mandi-green/5 font-bold uppercase tracking-wider"
            >
              <MessageCircle size={14} className="mr-1" />
              Help & Support
            </Button>
          </div>
          <div className="bg-gray-50 rounded-lg overflow-hidden divide-y divide-gray-200 border border-gray-100">
            {order.items?.map((item) => (
              <div key={item.id} className="px-4 py-2 flex justify-between items-center text-sm">
                <div>
                  <span className="font-medium text-gray-900">
                    {item.batchProduct?.product?.name || 'Product'}
                  </span>
                  <p className="text-xs text-mandi-muted">
                    {item.orderedQty} {item.batchProduct?.product?.unit} x{' '}
                    {formatCurrency(item.unitPrice)}
                  </p>
                </div>
                <div className="font-semibold text-mandi-dark">
                  {formatCurrency(item.lineTotal)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-mandi-cream/20 p-4 rounded-lg border border-mandi-cream/50">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-mandi-muted">Total Estimated</span>
            <span className="font-medium">{formatCurrency(order.estimatedTotal)}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-mandi-muted">Paid Amount</span>
            <span className="font-medium text-mandi-green">{formatCurrency(totalPaid)}</span>
          </div>
          <div className="flex justify-between text-base font-bold mt-2 pt-2 border-t border-mandi-cream/50">
            <span className="text-mandi-dark">Outstanding Balance</span>
            <span className={balance > 0 ? 'text-red-600' : 'text-mandi-green'}>
              {formatCurrency(balance)}
            </span>
          </div>
          {balance > 0 && (
            <p className="text-[10px] text-mandi-muted mt-2 italic">
              * Please pay the balance at the hub during collection.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
