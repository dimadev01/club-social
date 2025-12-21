export const PaymentDueStatus = {
  ACTIVE: 'active',
  VOIDED: 'voided',
} as const;

export type PaymentDueStatus =
  (typeof PaymentDueStatus)[keyof typeof PaymentDueStatus];

export const PaymentDueStatusLabel = {
  [PaymentDueStatus.ACTIVE]: 'Activo',
  [PaymentDueStatus.VOIDED]: 'Anulado',
} as const;
