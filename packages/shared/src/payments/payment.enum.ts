export const PaymentStatus = {
  PAID: 'paid',
  VOIDED: 'voided',
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PaymentStatusLabel = {
  [PaymentStatus.PAID]: 'Pagado',
  [PaymentStatus.VOIDED]: 'Anulado',
} as const;

export const PaymentDueStatus = {
  ACTIVE: 'active',
  VOIDED: 'voided',
} as const;

export type PaymentDueStatus = (typeof PaymentDueStatus)[keyof typeof PaymentDueStatus];

export const PaymentDueStatusLabel = {
  [PaymentDueStatus.ACTIVE]: 'Activo',
  [PaymentDueStatus.VOIDED]: 'Anulado',
} as const;
