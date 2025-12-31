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
  EXPENSE: 'expense',
  FAIR: 'fair',
  MAINTENANCE: 'maintenance',
  MEMBER_LEDGER: 'member-ledger',
  OTHER: 'other',
  PARKING: 'parking',
  PROFESSIONAL_SERVICES: 'professional-services',
  PROFESSOR: 'professor',
  SALOON: 'saloon',
  UTILITIES: 'utilities',
} as const;

export type MovementCategory =
  (typeof MovementCategory)[keyof typeof MovementCategory];

export const MovementCategoryLabel: Record<MovementCategory, string> = {
  [MovementCategory.BUFFET]: 'Buffet',
  [MovementCategory.COURT_RENTAL]: 'Alquiler de Cancha',
  [MovementCategory.EMPLOYEE]: 'Empleados',
  [MovementCategory.EXPENSE]: 'Gastos varios',
  [MovementCategory.FAIR]: 'Feria',
  [MovementCategory.MAINTENANCE]: 'Mantenimiento',
  [MovementCategory.MEMBER_LEDGER]: 'Ajuste de Cuenta',
  [MovementCategory.OTHER]: 'Otros',
  [MovementCategory.PARKING]: 'Estacionamiento',
  [MovementCategory.PROFESSIONAL_SERVICES]: 'Honorarios',
  [MovementCategory.PROFESSOR]: 'Profesor',
  [MovementCategory.SALOON]: 'Salón',
  [MovementCategory.UTILITIES]: 'Servicios',
} as const;

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
