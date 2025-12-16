export const DueCategory = {
  ELECTRICITY: 'electricity',
  GUEST: 'guest',
  MEMBERSHIP: 'membership',
} as const;

export type DueCategory = (typeof DueCategory)[keyof typeof DueCategory];

export const DueCategoryLabel = {
  [DueCategory.ELECTRICITY]: 'Electricidad',
  [DueCategory.GUEST]: 'Invitado',
  [DueCategory.MEMBERSHIP]: 'Cuota',
} as const;

export const DueStatus = {
  PAID: 'paid',
  PARTIALLY_PAID: 'partially-paid',
  PENDING: 'pending',
  VOIDED: 'voided',
} as const;

export type DueStatus = (typeof DueStatus)[keyof typeof DueStatus];

export const DueStatusLabel = {
  [DueStatus.PAID]: 'Pagado',
  [DueStatus.PARTIALLY_PAID]: 'Parcialmente Pagado',
  [DueStatus.PENDING]: 'Pendiente',
  [DueStatus.VOIDED]: 'Anulado',
} as const;
