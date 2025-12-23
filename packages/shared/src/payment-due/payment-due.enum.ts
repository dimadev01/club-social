export const PaymentDueStatus = {
  REGISTERED: 'registered',
  VOIDED: 'voided',
} as const;

export type PaymentDueStatus =
  (typeof PaymentDueStatus)[keyof typeof PaymentDueStatus];

export const PaymentDueStatusLabel = {
  [PaymentDueStatus.REGISTERED]: 'Registrado',
  [PaymentDueStatus.VOIDED]: 'Anulado',
} as const;
