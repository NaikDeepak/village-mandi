export interface Farmer {
  id: string;
  name: string;
  location: string;
  description?: string | null;
  relationshipLevel: 'SELF' | 'FAMILY' | 'FRIEND' | 'REFERRED';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
  products?: Product[];
}

export interface Product {
  id: string;
  farmerId: string;
  name: string;
  unit: string;
  description?: string | null;
  seasonStart?: string | null;
  seasonEnd?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  farmer?: {
    id: string;
    name: string;
    location: string;
    description?: string | null;
    relationshipLevel?: 'SELF' | 'FAMILY' | 'FRIEND' | 'REFERRED';
    isActive: boolean;
  };
}

export interface BatchProduct {
  id: string;
  batchId: string;
  productId: string;
  pricePerUnit: number;
  facilitationPercent: number;
  minOrderQty: number;
  maxOrderQty?: number | null;
  isActive: boolean;
  product: Product;
}

export interface CreateFarmerInput {
  name: string;
  location: string;
  description?: string;
  relationshipLevel: 'SELF' | 'FAMILY' | 'FRIEND' | 'REFERRED';
}

export interface UpdateFarmerInput extends Partial<CreateFarmerInput> {
  isActive?: boolean;
}

export interface CreateProductInput {
  farmerId: string;
  name: string;
  unit: string;
  description?: string;
  seasonStart?: string | null;
  seasonEnd?: string | null;
}

export interface UpdateProductInput extends Partial<Omit<CreateProductInput, 'farmerId'>> {
  isActive?: boolean;
}

export interface AddBatchProductInput {
  productId: string;
  pricePerUnit: number;
  facilitationPercent: number;
  minOrderQty: number;
  maxOrderQty?: number | null;
}

export interface UpdateBatchProductInput extends Partial<Omit<AddBatchProductInput, 'productId'>> {
  isActive?: boolean;
}

export interface Hub {
  id: string;
  name: string;
  address: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Batch {
  id: string;
  hubId: string;
  name: string;
  status: 'DRAFT' | 'OPEN' | 'CLOSED' | 'COLLECTED' | 'DELIVERED' | 'SETTLED';
  cutoffAt: string;
  deliveryDate: string;
  createdAt: string;
  updatedAt: string;
  hub?: Hub;
  allowedTransitions: readonly string[];
}

export interface CreateBatchInput {
  hubId: string;
  name: string;
  cutoffAt: string;
  deliveryDate: string;
}

export interface UpdateBatchInput extends Partial<CreateBatchInput> {}

export interface OrderItem {
  id: string;
  orderId: string;
  batchProductId: string;
  orderedQty: number;
  finalQty?: number | null;
  unitPrice: number;
  lineTotal: number;
  batchProduct?: BatchProduct;
}

export interface Order {
  id: string;
  batchId: string;
  buyerId: string;
  status:
    | 'PENDING'
    | 'COMMITMENT_PAID'
    | 'FULLY_PAID'
    | 'PACKED'
    | 'DISTRIBUTED'
    | 'CANCELLED'
    | 'PLACED';
  fulfillmentType: 'PICKUP' | 'DELIVERY';
  estimatedTotal: number;
  facilitationAmt: number;
  finalTotal?: number | null;
  createdAt: string;
  updatedAt: string;
  batch?: Batch;
  items?: OrderItem[];
  payments?: Payment[];
}

export interface CreateOrderInput {
  batchId: string;
  fulfillmentType: 'PICKUP' | 'DELIVERY';
  items: {
    batchProductId: string;
    orderedQty: number;
  }[];
}

export interface Payment {
  id: string;
  orderId: string;
  stage: 'COMMITMENT' | 'FINAL';
  amount: number;
  method: 'UPI' | 'CASH';
  referenceId?: string | null;
  paidAt: string;
}

export interface LogPaymentInput {
  amount: number;
  method: 'UPI' | 'CASH';
  stage: 'COMMITMENT' | 'FINAL';
  referenceId?: string;
  paidAt?: string;
}

export interface BatchAggregationFarmer {
  farmerId: string;
  farmerName: string;
  farmerLocation: string;
  products: {
    batchProductId: string;
    productId: string;
    productName: string;
    unit: string;
    totalQuantity: number;
  }[];
}

export interface BatchAggregation {
  aggregation: BatchAggregationFarmer[];
}

export interface FarmerPayout {
  id: string;
  batchId: string;
  farmerId: string;
  amount: number;
  upiReference: string;
  paidAt: string;
  createdAt: string;
  farmer: {
    name: string;
    location: string;
  };
}

export interface FarmerPayoutSummary {
  farmerId: string;
  name: string;
  location: string;
  totalOwed: number;
  totalPaid: number;
  balance: number;
}

export interface BatchPayoutsResponse {
  batchId: string;
  farmers: FarmerPayoutSummary[];
  payouts: FarmerPayout[];
}

export interface CreatePayoutInput {
  farmerId: string;
  amount: number;
  upiReference: string;
  paidAt: string;
}
