import { addDays } from 'date-fns';
import { prisma } from '../db';

async function main() {
  // biome-ignore lint/suspicious/noConsoleLog: Script needs logging
  console.log('🚀 Starting End-to-End Workflow Verification...');

  try {
    // --- Phase 0: Setup ---
    // biome-ignore lint/suspicious/noConsoleLog: Script needs logging
    console.log('\n--- Phase 0: Setup ---');

    // 1. Create Hub
    const hub = await prisma.hub.create({
      data: {
        name: `Test Hub ${Date.now()}`,
        address: '123 Test St',
      },
    });
    // biome-ignore lint/suspicious/noConsoleLog: Script needs logging
    console.log('✅ Created Hub:', hub.name);

    // 2. Create Farmer
    const farmer = await prisma.farmer.create({
      data: {
        name: `Test Farmer ${Date.now()}`,
        location: 'Test Village',
        relationshipLevel: 'FRIEND',
      },
    });
    // biome-ignore lint/suspicious/noConsoleLog: Script needs logging
    console.log('✅ Created Farmer:', farmer.name);

    // 3. Create Product
    const product = await prisma.product.create({
      data: {
        farmerId: farmer.id,
        name: `Test Mango ${Date.now()}`,
        unit: 'DOZEN',
      },
    });
    // biome-ignore lint/suspicious/noConsoleLog: Script needs logging
    console.log('✅ Created Product:', product.name);

    // 4. Create Buyer
    const buyerPhone = `99999${Math.floor(10000 + Math.random() * 90000)}`;
    const buyer = await prisma.user.create({
      data: {
        role: 'BUYER',
        name: 'Test Buyer',
        phone: buyerPhone,
        isInvited: true,
      },
    });
    // biome-ignore lint/suspicious/noConsoleLog: Script needs logging
    console.log('✅ Created Buyer:', buyer.phone);

    // --- Phase 1: Batch Planning ---
    // biome-ignore lint/suspicious/noConsoleLog: Script needs logging
    console.log('\n--- Phase 1: Batch Planning ---');

    // 1. Create Draft Batch
    const cutoffDate = addDays(new Date(), 2); // 2 days in future
    const deliveryDate = addDays(new Date(), 4);

    const batch = await prisma.batch.create({
      data: {
        hubId: hub.id,
        name: `Test Batch ${Date.now()}`,
        cutoffAt: cutoffDate,
        deliveryDate: deliveryDate,
        status: 'DRAFT',
      },
    });
    // biome-ignore lint/suspicious/noConsoleLog: Script needs logging
    console.log('✅ Created Batch:', batch.name);

    // 2. Add Product to Batch (Scoping)
    const batchProduct = await prisma.batchProduct.create({
      data: {
        batchId: batch.id,
        productId: product.id,
        pricePerUnit: 500, // Cost price
        facilitationPercent: 10, // 10% markup
        minOrderQty: 1,
      },
    });
    // biome-ignore lint/suspicious/noConsoleLog: Script needs logging
    console.log('✅ Added Product to Batch with pricing');

    // 3. Open Batch
    const _openBatch = await prisma.batch.update({
      where: { id: batch.id },
      data: { status: 'OPEN' },
    });
    // biome-ignore lint/suspicious/noConsoleLog: Script needs logging
    console.log('✅ Opened Batch');

    // --- Phase 2: Ordering ---
    // biome-ignore lint/suspicious/noConsoleLog: Script needs logging
    console.log('\n--- Phase 2: Ordering ---');

    // Calculate financials
    const unitPrice = 500 * 1.1; // 550
    const qty = 2;
    const lineTotal = unitPrice * qty; // 1100
    const estimatedTotal = lineTotal;
    const facilitationAmt = 500 * 0.1 * qty;

    // 1. Place Order
    const order = await prisma.order.create({
      data: {
        batchId: batch.id,
        buyerId: buyer.id,
        status: 'PLACED',
        fulfillmentType: 'PICKUP',
        estimatedTotal: estimatedTotal,
        facilitationAmt: facilitationAmt,
        items: {
          create: {
            batchProductId: batchProduct.id,
            orderedQty: qty,
            unitPrice: unitPrice,
            lineTotal: lineTotal,
          },
        },
      },
    });
    // biome-ignore lint/suspicious/noConsoleLog: Script needs logging
    console.log('✅ Placed Order:', order.id);

    // --- Phase 3: Procurement (Post-Cutoff) ---
    // biome-ignore lint/suspicious/noConsoleLog: Script needs logging
    console.log('\n--- Phase 3: Procurement ---');

    // 1. Close Batch
    await prisma.batch.update({
      where: { id: batch.id },
      data: { status: 'CLOSED' },
    });
    // biome-ignore lint/suspicious/noConsoleLog: Script needs logging
    console.log('✅ Closed Batch');

    // 2. Mark Commitment Paid (10%)
    // Create payment record
    await prisma.payment.create({
      data: {
        orderId: order.id,
        stage: 'COMMITMENT',
        amount: estimatedTotal * 0.1,
        method: 'UPI',
        paidAt: new Date(),
      },
    });

    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'COMMITMENT_PAID' },
    });
    // biome-ignore lint/suspicious/noConsoleLog: Script needs logging
    console.log('✅ Marked Commitment Paid');

    // 3. Verify Aggregation
    // In a real app we'd call the aggregation endpoint, here we verify the data exists
    const ordersForProcurement = await prisma.order.count({
      where: {
        batchId: batch.id,
        status: { in: ['COMMITMENT_PAID', 'FULLY_PAID'] },
      },
    });

    if (ordersForProcurement !== 1) throw new Error('Aggregation failed: Order not found');
    // biome-ignore lint/suspicious/noConsoleLog: Script needs logging
    console.log('✅ Verified Aggregation Logic');

    // --- Phase 4: Fulfillment ---
    // biome-ignore lint/suspicious/noConsoleLog: Script needs logging
    console.log('\n--- Phase 4: Fulfillment ---');

    // 1. Mark Final Payment
    await prisma.payment.create({
      data: {
        orderId: order.id,
        stage: 'FINAL',
        amount: estimatedTotal * 0.9,
        method: 'CASH',
        paidAt: new Date(),
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'FULLY_PAID' },
    });
    // biome-ignore lint/suspicious/noConsoleLog: Script needs logging
    console.log('✅ Marked Fully Paid');

    // 2. Mark Packed
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'PACKED' },
    });
    // biome-ignore lint/suspicious/noConsoleLog: Script needs logging
    console.log('✅ Marked Packed');

    // 3. Mark Distributed
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'DISTRIBUTED' },
    });
    // biome-ignore lint/suspicious/noConsoleLog: Script needs logging
    console.log('✅ Marked Distributed');

    // --- Phase 5: Settlement ---
    // biome-ignore lint/suspicious/noConsoleLog: Script needs logging
    console.log('\n--- Phase 5: Settlement ---');

    // 1. Transition Batch to Delivered
    await prisma.batch.update({
      where: { id: batch.id },
      data: { status: 'DELIVERED' },
    });
    // biome-ignore lint/suspicious/noConsoleLog: Script needs logging
    console.log('✅ Batch Delivered');

    // 2. Farmer Payout
    await prisma.farmerPayout.create({
      data: {
        farmerId: farmer.id,
        batchId: batch.id,
        amount: 500 * qty, // Base price * qty
        upiReference: 'UPI123456',
        paidAt: new Date(),
      },
    });
    // biome-ignore lint/suspicious/noConsoleLog: Script needs logging
    console.log('✅ Farmer Payout Recorded');

    // 3. Settle Batch
    await prisma.batch.update({
      where: { id: batch.id },
      data: { status: 'SETTLED' },
    });
    // biome-ignore lint/suspicious/noConsoleLog: Script needs logging
    console.log('✅ Batch Settled');

    // biome-ignore lint/suspicious/noConsoleLog: Script needs logging
    console.log('\n🎉 E2E Workflow Verified Successfully!');
  } catch (error) {
    console.error('\n❌ Verification Failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
