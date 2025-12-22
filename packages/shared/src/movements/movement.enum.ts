export const MovementType = {
  INFLOW: 'inflow',
  OUTFLOW: 'outflow',
} as const;

export type MovementType = (typeof MovementType)[keyof typeof MovementType];

export const MovementTypeLabel = {
  [MovementType.INFLOW]: 'Ingreso',
  [MovementType.OUTFLOW]: 'Egreso',
} as const;

export const MovementCategory = {
  MEMBERSHIP_FEE: 'membership-fee',
  OTHER: 'other',
  SALARY: 'salary',
  UTILITIES: 'utilities',
} as const;

export type MovementCategory =
  (typeof MovementCategory)[keyof typeof MovementCategory];

export const MovementCategoryLabel = {
  [MovementCategory.MEMBERSHIP_FEE]: 'Cuota',
  [MovementCategory.OTHER]: 'Otro',
  [MovementCategory.SALARY]: 'Salario',
  [MovementCategory.UTILITIES]: 'Servicios',
} as const;

export const MovementStatus = {
  REGISTERED: 'registered',
  VOIDED: 'voided',
} as const;

export type MovementStatus =
  (typeof MovementStatus)[keyof typeof MovementStatus];

export const MovementStatusLabel = {
  [MovementStatus.REGISTERED]: 'Registrado',
  [MovementStatus.VOIDED]: 'Anulado',
} as const;
