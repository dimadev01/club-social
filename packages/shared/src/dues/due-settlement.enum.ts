export const DueSettlementStatus = {
  APPLIED: 'applied',
  VOIDED: 'voided',
} as const;

export type DueSettlementStatus =
  (typeof DueSettlementStatus)[keyof typeof DueSettlementStatus];

export const DueSettlementSource = {
  ADJUSTMENT: 'adjustment',
  PAYMENT: 'payment',
} as const;

export type DueSettlementSource =
  (typeof DueSettlementSource)[keyof typeof DueSettlementSource];
