/**
 * VIRTUAL MANDI - SYSTEM GUARDRAILS
 * These constants define the non-negotiable rules of the aggregation system.
 */

export const SYSTEM_RULES = {
  FACILITATION_FEE_PERCENTAGE: 10, // 10% commitment fee
  DEFAULT_PICKUP_COST: 0,
  FARMER_LOGIN_ENABLED: false, // Non-negotiable: No farmer login
  BUYER_FARMER_CHAT_ENABLED: false, // Non-negotiable: No buyer-farmer communication
  EDIT_AFTER_CUTOFF_ALLOWED: false, // Non-negotiable: No edits after cutoff
  TWO_STAGE_PAYMENT_ENABLED: true, // Non-negotiable: 10% commitment -> settlement
} as const;

export enum BATCH_STATUS {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN', // Changed from ACTIVE
  CLOSED = 'CLOSED', // Changed from LOCKED
  COLLECTED = 'COLLECTED', // Changed from PROCUREMENT
  DELIVERED = 'DELIVERED', // Added
  SETTLED = 'SETTLED', // Changed from FULFILLED
}

export const PAYMENT_STAGES = {
  COMMITMENT: 'COMMITMENT', // 10%
  SETTLEMENT: 'SETTLEMENT', // Final balance
} as const;

export const MESSAGING_CHANNELS = {
  WHATSAPP_CLICK_TO_CHAT: true,
} as const;
