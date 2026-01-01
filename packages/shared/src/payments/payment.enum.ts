export const PaymentStatus = {
  PAID: 'paid',
  VOIDED: 'voided',
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PaymentStatusLabel = {
  [PaymentStatus.PAID]: 'Pagado',
  [PaymentStatus.VOIDED]: 'Anulado',
} as const;
