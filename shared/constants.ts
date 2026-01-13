/**
 * VIRTUAL MANDI - SYSTEM GUARDRAILS
 * These constants define the non-negotiable rules of the aggregation system.
 */

export const SYSTEM_RULES = {
  FACITILATION_FEE_PERCENTAGE: 10, // 10% commitment fee
  DEFAULT_PICKUP_COST: 0,
  FARMER_LOGIN_ENABLED: false,
  BUYER_FARMER_CHAT_ENABLED: false,
  EDIT_AFTER_CUTOFF_ALLOWED: false,
  TWO_STAGE_PAYMENT_ENABLED: true,
} as const;

export enum BATCH_STATUS {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  LOCKED = 'LOCKED',
  PROCUREMENT = 'PROCUREMENT',
  FULFILLED = 'FULFILLED',
  CANCELLED = 'CANCELLED',
}

export const PAYMENT_STAGES = {
  COMMITMENT: 'COMMITMENT', // 10%
  SETTLEMENT: 'SETTLEMENT', // Final balance
} as const;

export const MESSAGING_CHANNELS = {
  WHATSAPP_CLICK_TO_CHAT: true,
} as const;
