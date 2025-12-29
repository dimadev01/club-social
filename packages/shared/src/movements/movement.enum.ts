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
  BUFFET: 'buffet',
  COURT_RENTAL: 'court-rental',
  EMPLOYEE: 'employee',
  FAIR: 'fair',
  MEMBERSHIP_FEE: 'membership-fee',
  OTHER: 'other',
  PARKING: 'parking',
  PROFESSIONAL_SERVICES: 'professional-services',
  UTILITIES: 'utilities',
} as const;

export type MovementCategory =
  (typeof MovementCategory)[keyof typeof MovementCategory];

export const MovementCategoryLabel: Record<MovementCategory, string> = {
  [MovementCategory.BUFFET]: 'Buffet',
  [MovementCategory.COURT_RENTAL]: 'Alquiler de Cancha',
  [MovementCategory.EMPLOYEE]: 'Empleados',
  [MovementCategory.FAIR]: 'Feria',
  [MovementCategory.MEMBERSHIP_FEE]: 'Cuota',
  [MovementCategory.OTHER]: 'Otro',
  [MovementCategory.PARKING]: 'Estacionamiento',
  [MovementCategory.PROFESSIONAL_SERVICES]: 'Honorarios',
  [MovementCategory.UTILITIES]: 'Servicios',
} as const;

export const MovementCategoryOptions = Object.entries(MovementCategoryLabel)
  .map(([key, value]) => ({ label: value, value: key }))
  .sort((a, b) => a.label.localeCompare(b.label));

export const MovementStatus = {
  REGISTERED: 'registered',
  REVERSED: 'reversed',
  VOIDED: 'voided',
} as const;

export type MovementStatus =
  (typeof MovementStatus)[keyof typeof MovementStatus];

export const MovementStatusLabel = {
  [MovementStatus.REGISTERED]: 'Registrado',
  [MovementStatus.REVERSED]: 'Revertido',
  [MovementStatus.VOIDED]: 'Anulado',
} as const;

export const MovementMode = {
  AUTOMATIC: 'automatic',
  MANUAL: 'manual',
} as const;

export type MovementMode = (typeof MovementMode)[keyof typeof MovementMode];

export const MovementModeLabel = {
  [MovementMode.AUTOMATIC]: 'Automático',
  [MovementMode.MANUAL]: 'Manual',
} as const;
