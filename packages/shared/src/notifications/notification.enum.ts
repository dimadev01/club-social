export const NotificationChannel = {
  EMAIL: 'email',
  PUSH: 'push',
  SMS: 'sms',
} as const;

export type NotificationChannel =
  (typeof NotificationChannel)[keyof typeof NotificationChannel];

export const NotificationChannelLabel = {
  [NotificationChannel.EMAIL]: 'Email',
  [NotificationChannel.PUSH]: 'Push',
  [NotificationChannel.SMS]: 'SMS',
} as const;

export const NotificationStatus = {
  BOUNCED: 'bounced',
  DELIVERED: 'delivered',
  FAILED: 'failed',
  PENDING: 'pending',
  PROCESSING: 'processing',
  QUEUED: 'queued',
  SENT: 'sent',
  SUPPRESSED: 'suppressed',
} as const;

export type NotificationStatus =
  (typeof NotificationStatus)[keyof typeof NotificationStatus];

export const NotificationStatusLabel = {
  [NotificationStatus.BOUNCED]: 'Rebotado',
  [NotificationStatus.DELIVERED]: 'Entregado',
  [NotificationStatus.FAILED]: 'Fallido',
  [NotificationStatus.PENDING]: 'Pendiente',
  [NotificationStatus.PROCESSING]: 'Procesando',
  [NotificationStatus.QUEUED]: 'En cola',
  [NotificationStatus.SENT]: 'Enviado',
  [NotificationStatus.SUPPRESSED]: 'Suprimido',
} as const;

export const NotificationType = {
  // Member-facing
  DUE_CREATED: 'due_created',
  // User-facing
  DUE_OVERDUE: 'due_overdue',
  MEMBER_CREATED: 'member_created',
  MOVEMENT_CREATED: 'movement_created',
  MOVEMENT_VOIDED: 'movement_voided',
  PAYMENT_MADE: 'payment_made',
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export const NotificationTypeLabel = {
  [NotificationType.DUE_CREATED]: 'Deuda creada',
  [NotificationType.DUE_OVERDUE]: 'Deuda vencida',
  [NotificationType.MEMBER_CREATED]: 'Socio creado',
  [NotificationType.MOVEMENT_CREATED]: 'Movimiento creado',
  [NotificationType.MOVEMENT_VOIDED]: 'Movimiento anulado',
  [NotificationType.PAYMENT_MADE]: 'Pago realizado',
} as const;

export const EmailSuppressionReason = {
  BOUNCE: 'bounce',
  COMPLAINT: 'complaint',
} as const;

export type EmailSuppressionReason =
  (typeof EmailSuppressionReason)[keyof typeof EmailSuppressionReason];

export const EmailSuppressionReasonLabel = {
  [EmailSuppressionReason.BOUNCE]: 'Rebote',
  [EmailSuppressionReason.COMPLAINT]: 'Queja de spam',
} as const;
