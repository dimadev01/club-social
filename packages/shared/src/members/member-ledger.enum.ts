export const MemberLedgerEntryStatus = {
  POSTED: 'posted',
  REVERSED: 'reversed',
} as const;

export type MemberLedgerEntryStatus =
  (typeof MemberLedgerEntryStatus)[keyof typeof MemberLedgerEntryStatus];

export const MemberLedgerEntryStatusLabel = {
  [MemberLedgerEntryStatus.POSTED]: 'Publicado',
  [MemberLedgerEntryStatus.REVERSED]: 'Revertido',
} as const;

export const MemberLedgerEntryType = {
  // Money entering
  ADJUSTMENT_CREDIT: 'adjustment-credit',
  ADJUSTMENT_DEBIT: 'adjustment-debit',

  // Money leaving
  BALANCE_APPLY_DEBIT: 'balance-apply-debit',
  DUE_APPLY_DEBIT: 'due-apply-debit',
  PAYMENT_CREDIT: 'payment-credit',
  REFUND_DEBIT: 'refund-debit',

  // Correction
  REVERSAL: 'reversal',
} as const;

export type MemberLedgerEntryType =
  (typeof MemberLedgerEntryType)[keyof typeof MemberLedgerEntryType];

export const MemberLedgerEntrySource = {
  ADJUSTMENT: 'adjustment',
  PAYMENT: 'payment',
} as const;

export type MemberLedgerEntrySource =
  (typeof MemberLedgerEntrySource)[keyof typeof MemberLedgerEntrySource];
