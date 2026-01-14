import {
  BatchStatus,
  FulfillmentType,
  OrderStatus,
  PaymentMethod,
  PaymentStage,
  RelationshipLevel,
  UserRole,
} from '@prisma/client';
import { prisma } from '../db';
import { hashPassword } from '../src/utils/password';

async function main() {
  // =====================
  // 1. ADMIN USER (with hashed password)
  // =====================
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';
  const adminPasswordHash = await hashPassword(adminPassword);

  const _admin = await prisma.user.upsert({
    where: { phone: '9999999999' },
    update: {
      passwordHash: adminPasswordHash,
    },
    create: {
      name: 'Deepak Naik',
      phone: '9999999999',
      email: 'admin@virtualmandi.com',
      role: UserRole.ADMIN,
      passwordHash: adminPasswordHash,
      isInvited: true, // Admin is always invited
    },
  });
  if (process.env.NODE_ENV !== 'production') {
  } else {
  }

  // =====================
  // 2. BUYERS (with isInvited = true for testing)
  // =====================
  const buyers = await Promise.all([
    prisma.user.upsert({
      where: { phone: '9876543210' },
      update: { isInvited: true },
      create: {
        name: 'Priya Sharma',
        phone: '9876543210',
        email: 'priya@example.com',
        role: UserRole.BUYER,
        isInvited: true,
      },
    }),
    prisma.user.upsert({
      where: { phone: '9876543211' },
      update: { isInvited: true },
      create: {
        name: 'Amit Patel',
        phone: '9876543211',
        email: 'amit@example.com',
        role: UserRole.BUYER,
        isInvited: true,
      },
    }),
    prisma.user.upsert({
      where: { phone: '9876543212' },
      update: { isInvited: true },
      create: {
        name: 'Sneha Reddy',
        phone: '9876543212',
        role: UserRole.BUYER,
        isInvited: true,
      },
    }),
    prisma.user.upsert({
      where: { phone: '9876543213' },
      update: { isInvited: true },
      create: {
        name: 'Rahul Verma',
        phone: '9876543213',
        role: UserRole.BUYER,
        isInvited: true,
      },
    }),
    prisma.user.upsert({
      where: { phone: '9876543214' },
      update: { isInvited: true },
      create: {
        name: 'Kavita Iyer',
        phone: '9876543214',
        email: 'kavita@example.com',
        role: UserRole.BUYER,
        isInvited: true,
      },
    }),
  ]);

  // =====================
  // 3. HUBS
  // =====================
  const hubs = await Promise.all([
    prisma.hub.create({
      data: {
        name: 'Koramangala Hub',
        address: '80 Feet Road, Koramangala, Bangalore 560034',
      },
    }),
    prisma.hub.create({
      data: {
        name: 'Indiranagar Hub',
        address: '100 Feet Road, Indiranagar, Bangalore 560038',
      },
    }),
  ]);

  // =====================
  // 4. FARMERS
  // =====================
  const farmers = await Promise.all([
    // SELF - Direct family farm
    prisma.farmer.create({
      data: {
        name: 'Ramesh Kumar',
        location: 'Nasik, Maharashtra',
        description: 'Third-generation onion and grape farmer. 15 acres of organic farmland.',
        relationshipLevel: RelationshipLevel.SELF,
      },
    }),
    // FAMILY - Close relative
    prisma.farmer.create({
      data: {
        name: 'Lakshmi Devi',
        location: 'Chikmagalur, Karnataka',
        description: 'Coffee and pepper estate. Shade-grown arabica specialist.',
        relationshipLevel: RelationshipLevel.FAMILY,
      },
    }),
    // FRIEND - Trusted network
    prisma.farmer.create({
      data: {
        name: 'Suresh Gowda',
        location: 'Mandya, Karnataka',
        description: 'Sugarcane and banana farmer. Supplies to local cooperatives.',
        relationshipLevel: RelationshipLevel.FRIEND,
      },
    }),
    // REFERRED - Vetted referral
    prisma.farmer.create({
      data: {
        name: 'Mohammed Ismail',
        location: 'Raichur, Karnataka',
        description: 'Mango and pomegranate orchards. 20 years experience.',
        relationshipLevel: RelationshipLevel.REFERRED,
      },
    }),
    // Another FAMILY farmer
    prisma.farmer.create({
      data: {
        name: 'Anita Kulkarni',
        location: 'Dharwad, Karnataka',
        description: 'Organic vegetable farm. Pesticide-free for 10 years.',
        relationshipLevel: RelationshipLevel.FAMILY,
      },
    }),
  ]);

  // =====================
  // 5. PRODUCTS (Multiple per farmer)
  // =====================
  const products = await Promise.all([
    // Ramesh Kumar - Nasik (Onions, Grapes)
    prisma.product.create({
      data: {
        farmerId: farmers[0].id,
        name: 'Red Onions',
        unit: 'KG',
        description: 'Nashik Red Onions, medium size, excellent storage life',
      },
    }),
    prisma.product.create({
      data: {
        farmerId: farmers[0].id,
        name: 'White Onions',
        unit: 'KG',
        description: 'Sweet white onions, perfect for salads',
      },
    }),
    prisma.product.create({
      data: {
        farmerId: farmers[0].id,
        name: 'Thompson Grapes',
        unit: 'KG',
        description: 'Seedless green grapes, export quality',
        seasonStart: new Date('2025-02-01'),
        seasonEnd: new Date('2025-05-31'),
      },
    }),

    // Lakshmi Devi - Chikmagalur (Coffee, Pepper)
    prisma.product.create({
      data: {
        farmerId: farmers[1].id,
        name: 'Arabica Coffee Beans',
        unit: 'KG',
        description: 'Single-origin shade-grown arabica, medium roast',
      },
    }),
    prisma.product.create({
      data: {
        farmerId: farmers[1].id,
        name: 'Black Pepper',
        unit: 'KG',
        description: 'Malabar black pepper, hand-picked and sun-dried',
      },
    }),

    // Suresh Gowda - Mandya (Banana, Jaggery)
    prisma.product.create({
      data: {
        farmerId: farmers[2].id,
        name: 'Yelakki Banana',
        unit: 'DOZEN',
        description: 'Small sweet bananas, naturally ripened',
      },
    }),
    prisma.product.create({
      data: {
        farmerId: farmers[2].id,
        name: 'Nendran Banana',
        unit: 'KG',
        description: 'Kerala-style cooking banana',
      },
    }),
    prisma.product.create({
      data: {
        farmerId: farmers[2].id,
        name: 'Organic Jaggery',
        unit: 'KG',
        description: 'Pure sugarcane jaggery, no chemicals',
      },
    }),

    // Mohammed Ismail - Raichur (Mango, Pomegranate)
    prisma.product.create({
      data: {
        farmerId: farmers[3].id,
        name: 'Alphonso Mango',
        unit: 'DOZEN',
        description: 'Premium Alphonso, carbide-free ripening',
        seasonStart: new Date('2025-04-01'),
        seasonEnd: new Date('2025-06-30'),
      },
    }),
    prisma.product.create({
      data: {
        farmerId: farmers[3].id,
        name: 'Bhagwa Pomegranate',
        unit: 'KG',
        description: 'Deep red arils, high juice content',
        seasonStart: new Date('2025-09-01'),
        seasonEnd: new Date('2025-12-31'),
      },
    }),

    // Anita Kulkarni - Dharwad (Vegetables)
    prisma.product.create({
      data: {
        farmerId: farmers[4].id,
        name: 'Organic Tomatoes',
        unit: 'KG',
        description: 'Desi tomatoes, vine-ripened',
      },
    }),
    prisma.product.create({
      data: {
        farmerId: farmers[4].id,
        name: 'Green Chillies',
        unit: 'KG',
        description: 'Medium spice, perfect for daily cooking',
      },
    }),
    prisma.product.create({
      data: {
        farmerId: farmers[4].id,
        name: 'Fresh Coriander',
        unit: 'BUNCH',
        description: 'Farm-fresh coriander leaves',
      },
    }),
    prisma.product.create({
      data: {
        farmerId: farmers[4].id,
        name: 'Curry Leaves',
        unit: 'BUNCH',
        description: 'Aromatic curry leaves, pesticide-free',
      },
    }),
  ]);

  // =====================
  // 6. BATCHES (Different states)
  // =====================
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const batches = await Promise.all([
    // DRAFT batch - being prepared
    prisma.batch.create({
      data: {
        hubId: hubs[0].id,
        name: 'Week 4 - January 2025',
        status: BatchStatus.DRAFT,
        cutoffAt: nextWeek,
        deliveryDate: new Date(nextWeek.getTime() + 3 * 24 * 60 * 60 * 1000),
      },
    }),
    // OPEN batch - accepting orders
    prisma.batch.create({
      data: {
        hubId: hubs[0].id,
        name: 'Week 3 - January 2025',
        status: BatchStatus.OPEN,
        openAt: lastWeek,
        cutoffAt: tomorrow,
        deliveryDate: new Date(tomorrow.getTime() + 2 * 24 * 60 * 60 * 1000),
      },
    }),
    // CLOSED batch - orders locked
    prisma.batch.create({
      data: {
        hubId: hubs[0].id,
        name: 'Week 2 - January 2025',
        status: BatchStatus.CLOSED,
        openAt: twoWeeksAgo,
        cutoffAt: lastWeek,
        deliveryDate: now,
      },
    }),
    // COLLECTED batch - procurement done
    prisma.batch.create({
      data: {
        hubId: hubs[1].id,
        name: 'Week 1 - January 2025',
        status: BatchStatus.COLLECTED,
        openAt: new Date(twoWeeksAgo.getTime() - 7 * 24 * 60 * 60 * 1000),
        cutoffAt: twoWeeksAgo,
        deliveryDate: lastWeek,
      },
    }),
    // SETTLED batch - fully complete
    prisma.batch.create({
      data: {
        hubId: hubs[1].id,
        name: 'Week 52 - December 2024',
        status: BatchStatus.SETTLED,
        openAt: new Date(twoWeeksAgo.getTime() - 14 * 24 * 60 * 60 * 1000),
        cutoffAt: new Date(twoWeeksAgo.getTime() - 7 * 24 * 60 * 60 * 1000),
        deliveryDate: twoWeeksAgo,
      },
    }),
  ]);

  // =====================
  // 7. BATCH PRODUCTS (Pricing for OPEN batch)
  // =====================
  const openBatch = batches[1]; // OPEN batch
  const closedBatch = batches[2]; // CLOSED batch

  const batchProducts = await Promise.all([
    // Red Onions
    prisma.batchProduct.create({
      data: {
        batchId: openBatch.id,
        productId: products[0].id, // Red Onions
        pricePerUnit: 40,
        facilitationPercent: 10,
        minOrderQty: 2,
        maxOrderQty: 20,
      },
    }),
    // White Onions
    prisma.batchProduct.create({
      data: {
        batchId: openBatch.id,
        productId: products[1].id, // White Onions
        pricePerUnit: 50,
        facilitationPercent: 10,
        minOrderQty: 1,
        maxOrderQty: 10,
      },
    }),
    // Yelakki Banana
    prisma.batchProduct.create({
      data: {
        batchId: openBatch.id,
        productId: products[5].id, // Yelakki Banana
        pricePerUnit: 60,
        facilitationPercent: 10,
        minOrderQty: 2,
        maxOrderQty: 10,
      },
    }),
    // Organic Jaggery
    prisma.batchProduct.create({
      data: {
        batchId: openBatch.id,
        productId: products[7].id, // Organic Jaggery
        pricePerUnit: 120,
        facilitationPercent: 10,
        minOrderQty: 1,
        maxOrderQty: 5,
      },
    }),
    // Organic Tomatoes
    prisma.batchProduct.create({
      data: {
        batchId: openBatch.id,
        productId: products[10].id, // Organic Tomatoes
        pricePerUnit: 60,
        facilitationPercent: 10,
        minOrderQty: 1,
        maxOrderQty: 10,
      },
    }),
    // Fresh Coriander
    prisma.batchProduct.create({
      data: {
        batchId: openBatch.id,
        productId: products[12].id, // Fresh Coriander
        pricePerUnit: 20,
        facilitationPercent: 10,
        minOrderQty: 2,
        maxOrderQty: 10,
      },
    }),
    // Curry Leaves
    prisma.batchProduct.create({
      data: {
        batchId: openBatch.id,
        productId: products[13].id, // Curry Leaves
        pricePerUnit: 15,
        facilitationPercent: 10,
        minOrderQty: 2,
        maxOrderQty: 10,
      },
    }),

    // CLOSED batch products (for orders)
    prisma.batchProduct.create({
      data: {
        batchId: closedBatch.id,
        productId: products[0].id, // Red Onions
        pricePerUnit: 38,
        facilitationPercent: 10,
        minOrderQty: 2,
      },
    }),
    prisma.batchProduct.create({
      data: {
        batchId: closedBatch.id,
        productId: products[5].id, // Yelakki Banana
        pricePerUnit: 55,
        facilitationPercent: 10,
        minOrderQty: 2,
      },
    }),
  ]);

  // =====================
  // 8. ORDERS (For CLOSED batch - with payments)
  // =====================
  const closedBatchProducts = batchProducts.slice(7); // Last 2 are for closed batch

  // Order 1: Priya - FULLY_PAID with delivery
  const order1 = await prisma.order.create({
    data: {
      batchId: closedBatch.id,
      buyerId: buyers[0].id, // Priya
      status: OrderStatus.FULLY_PAID,
      estimatedTotal: 500,
      facilitationAmt: 50,
      finalTotal: 495,
      fulfillmentType: FulfillmentType.DELIVERY,
      deliveryFee: 50,
    },
  });

  // Order 1 Items
  await prisma.orderItem.createMany({
    data: [
      {
        orderId: order1.id,
        batchProductId: closedBatchProducts[0].id, // Red Onions
        orderedQty: 5,
        finalQty: 4.8,
        unitPrice: 38,
        lineTotal: 182.4,
      },
      {
        orderId: order1.id,
        batchProductId: closedBatchProducts[1].id, // Yelakki Banana
        orderedQty: 4,
        finalQty: 4,
        unitPrice: 55,
        lineTotal: 220,
      },
    ],
  });

  // Order 1 Payments (Two-stage)
  await prisma.payment.createMany({
    data: [
      {
        orderId: order1.id,
        stage: PaymentStage.COMMITMENT,
        amount: 50,
        method: PaymentMethod.UPI,
        referenceId: 'UPI123456789',
        paidAt: lastWeek,
      },
      {
        orderId: order1.id,
        stage: PaymentStage.FINAL,
        amount: 445,
        method: PaymentMethod.UPI,
        referenceId: 'UPI987654321',
        paidAt: new Date(lastWeek.getTime() + 2 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  // Order 2: Amit - COMMITMENT_PAID (pickup)
  const order2 = await prisma.order.create({
    data: {
      batchId: closedBatch.id,
      buyerId: buyers[1].id, // Amit
      status: OrderStatus.COMMITMENT_PAID,
      estimatedTotal: 304,
      facilitationAmt: 30.4,
      fulfillmentType: FulfillmentType.PICKUP,
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: order2.id,
      batchProductId: closedBatchProducts[0].id, // Red Onions
      orderedQty: 8,
      unitPrice: 38,
      lineTotal: 304,
    },
  });

  await prisma.payment.create({
    data: {
      orderId: order2.id,
      stage: PaymentStage.COMMITMENT,
      amount: 30.4,
      method: PaymentMethod.UPI,
      referenceId: 'UPI111222333',
      paidAt: lastWeek,
    },
  });

  // =====================
  // 9. EVENT LOG (Sample entries)
  // =====================
  await prisma.eventLog.createMany({
    data: [
      {
        entityType: 'BATCH',
        entityId: openBatch.id,
        action: 'STATUS_CHANGE',
        metadata: { from: 'DRAFT', to: 'OPEN' },
      },
      {
        entityType: 'BATCH',
        entityId: closedBatch.id,
        action: 'STATUS_CHANGE',
        metadata: { from: 'OPEN', to: 'CLOSED' },
      },
      {
        entityType: 'ORDER',
        entityId: order1.id,
        action: 'PAYMENT_RECEIVED',
        metadata: { stage: 'COMMITMENT', amount: 50 },
      },
      {
        entityType: 'ORDER',
        entityId: order1.id,
        action: 'PAYMENT_RECEIVED',
        metadata: { stage: 'FINAL', amount: 445 },
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
