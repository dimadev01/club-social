export const AuditAction = {
  CREATED: 'CREATED',
  DELETED: 'DELETED',
  UPDATED: 'UPDATED',
  VOIDED: 'VOIDED',
} as const;

export type AuditAction = (typeof AuditAction)[keyof typeof AuditAction];

export const AuditActionLabel: Record<AuditAction, string> = {
  [AuditAction.CREATED]: 'Creado',
  [AuditAction.DELETED]: 'Eliminado',
  [AuditAction.UPDATED]: 'Actualizado',
  [AuditAction.VOIDED]: 'Anulado',
} as const;

export const AuditEntity = {
  DUE: 'DUE',
  MEMBER: 'MEMBER',
  MOVEMENT: 'MOVEMENT',
  PAYMENT: 'PAYMENT',
  USER: 'USER',
} as const;

export type AuditEntity = (typeof AuditEntity)[keyof typeof AuditEntity];

export const AuditEntityLabel: Record<AuditEntity, string> = {
  [AuditEntity.DUE]: 'Cuota',
  [AuditEntity.MEMBER]: 'Socio',
  [AuditEntity.MOVEMENT]: 'Movimiento',
  [AuditEntity.PAYMENT]: 'Pago',
  [AuditEntity.USER]: 'Usuario',
} as const;
