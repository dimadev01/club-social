export const AuditAction = {
  CREATED: 'created',
  DELETED: 'deleted',
  UPDATED: 'updated',
  VOIDED: 'voided',
} as const;

export type AuditAction = (typeof AuditAction)[keyof typeof AuditAction];

export const AuditActionLabel: Record<AuditAction, string> = {
  [AuditAction.CREATED]: 'Creado',
  [AuditAction.DELETED]: 'Eliminado',
  [AuditAction.UPDATED]: 'Actualizado',
  [AuditAction.VOIDED]: 'Anulado',
} as const;

export const AuditEntity = {
  APP_SETTING: 'app-setting',
  DUE: 'due',
  GROUP: 'group',
  MEMBER: 'member',
  MEMBER_LEDGER_ENTRY: 'member-ledger-entry',
  MOVEMENT: 'movement',
  PAYMENT: 'payment',
  PRICING: 'pricing',
  USER: 'user',
} as const;

export type AuditEntity = (typeof AuditEntity)[keyof typeof AuditEntity];

export const AuditEntityLabel: Record<AuditEntity, string> = {
  [AuditEntity.APP_SETTING]: 'Configuración de la aplicación',
  [AuditEntity.DUE]: 'Cuota',
  [AuditEntity.GROUP]: 'Grupo',
  [AuditEntity.MEMBER]: 'Socio',
  [AuditEntity.MEMBER_LEDGER_ENTRY]: 'Entrada de libro de miembros',
  [AuditEntity.MOVEMENT]: 'Movimiento',
  [AuditEntity.PAYMENT]: 'Pago',
  [AuditEntity.PRICING]: 'Precio',
  [AuditEntity.USER]: 'Usuario',
} as const;
