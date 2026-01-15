/**
 * Utility for generating WhatsApp click-to-chat links
 */

export const getWhatsAppLink = (phone: string, message: string) => {
  // Remove all non-numeric characters
  let cleanPhone = phone.replace(/\D/g, '');

  // Add 91 prefix if it's a 10-digit number
  if (cleanPhone.length === 10) {
    cleanPhone = `91${cleanPhone}`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

export const templates = {
  batchOpen: (batchName: string, deliveryDate: string) =>
    `Namaste! A new batch *${batchName}* is now open at Village Mandi. Place your orders by tomorrow for fresh delivery on ${deliveryDate}. Visit: ${window.location.origin}/shop`,

  paymentRequest: (amount: number, stage: 'advance' | 'final', batchName: string) =>
    `Payment Request: Please pay ₹${amount.toFixed(2)} as ${stage} payment for your order in *${batchName}*. You can pay via UPI to the hub manager.`,

  orderPacked: (batchName: string) =>
    `Good news! Your order in *${batchName}* has been packed and is ready. It will be delivered/ready for pickup as per the schedule.`,

  payoutConfirmation: (amount: number, batchName: string, ref: string) =>
    `Farmer Payout: We have processed your payment of ₹${amount.toFixed(2)} for *${batchName}*. Ref: ${ref}. Thank you for your produce!`,

  supportRequest: (userName: string) =>
    `Hi Hub Manager, I am ${userName}. I need help with my Village Mandi order.`,
};
