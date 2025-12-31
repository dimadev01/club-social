/* eslint-disable perfectionist/sort-objects */
export const MemberLedgerEntryStatus = {
  POSTED: 'posted',
  REVERSED: 'reversed',
} as const;

export type MemberLedgerEntryStatus =
  (typeof MemberLedgerEntryStatus)[keyof typeof MemberLedgerEntryStatus];

export const MemberLedgerEntryStatusLabel = {
  [MemberLedgerEntryStatus.POSTED]: 'Contabilizado',
  [MemberLedgerEntryStatus.REVERSED]: 'Revertido',
} as const;

export const MemberLedgerEntryType = {
  // Credits (money entering / balance increasing)
  DEPOSIT_CREDIT: 'deposit-credit', // Deposit received
  ADJUSTMENT_CREDIT: 'adjustment-credit', // Manual positive adjustment

  // Debits (money leaving / balance decreasing)
  DUE_APPLY_DEBIT: 'due-apply-debit', // Applied to settle a due
  BALANCE_APPLY_DEBIT: 'balance-apply-debit', // Applied from existing balance
  REFUND_DEBIT: 'refund-debit', // Money refunded out
  ADJUSTMENT_DEBIT: 'adjustment-debit', // Manual negative adjustment

  // Corrections
  REVERSAL_CREDIT: 'reversal-credit', // Reverses another entry
} as const;

export type MemberLedgerEntryType =
  (typeof MemberLedgerEntryType)[keyof typeof MemberLedgerEntryType];

export const MemberLedgerEntrySource = {
  ADJUSTMENT: 'adjustment',
  PAYMENT: 'payment',
} as const;

export type MemberLedgerEntrySource =
  (typeof MemberLedgerEntrySource)[keyof typeof MemberLedgerEntrySource];

export const MemberLedgerEntrySourceLabel = {
  [MemberLedgerEntrySource.ADJUSTMENT]: 'Ajuste',
  [MemberLedgerEntrySource.PAYMENT]: 'Pago',
} as const;

export const MemberLedgerEntryTypeLabel = {
  [MemberLedgerEntryType.DEPOSIT_CREDIT]: 'Depósito',
  [MemberLedgerEntryType.ADJUSTMENT_CREDIT]: 'Ajuste positivo',
  [MemberLedgerEntryType.DUE_APPLY_DEBIT]: 'Pago de deuda',
  [MemberLedgerEntryType.BALANCE_APPLY_DEBIT]: 'Aplicación de saldo',
  [MemberLedgerEntryType.REFUND_DEBIT]: 'Reembolso',
  [MemberLedgerEntryType.ADJUSTMENT_DEBIT]: 'Ajuste negativo',
  [MemberLedgerEntryType.REVERSAL_CREDIT]: 'Reversión',
} as const;

export const MemberLedgerEntryTypeSorted = Object.entries(
  MemberLedgerEntryTypeLabel,
)
  .map(([key, value]) => ({ label: value, value: key }))
  .sort((a, b) => a.label.localeCompare(b.label));

export const MemberLedgerEntryMovementType = {
  INFLOW: 'inflow',
  OUTFLOW: 'outflow',
} as const;

export type MemberLedgerEntryMovementType =
  (typeof MemberLedgerEntryMovementType)[keyof typeof MemberLedgerEntryMovementType];

export const MemberLedgerEntryMovementTypeLabel = {
  [MemberLedgerEntryMovementType.INFLOW]: 'Ingreso',
  [MemberLedgerEntryMovementType.OUTFLOW]: 'Egreso',
} as const;
