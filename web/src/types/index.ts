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
    isActive: boolean;
  };
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
