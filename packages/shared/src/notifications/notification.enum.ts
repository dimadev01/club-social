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
  DUE_CREATED: 'due_created',
  MEMBER_CREATED: 'member_created',
  MOVEMENT_CREATED: 'movement_created',
  MOVEMENT_VOIDED: 'movement_voided',
  PAYMENT_MADE: 'payment_made',
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

/**
 * Notification types that can be sent to members about their own account.
 * Members can opt in/out of these via notifyOnDueCreated and notifyOnPaymentMade.
 */
export const MemberNotificationTypes = [
  NotificationType.DUE_CREATED,
  NotificationType.PAYMENT_MADE,
] as const;

export type MemberNotificationType = (typeof MemberNotificationTypes)[number];

/**
 * Notification types that can be sent to staff/admin about system-wide activity.
 * Staff can opt in/out of these via all 5 notification preference flags.
 */
export const SubscriberNotificationTypes = [
  NotificationType.DUE_CREATED,
  NotificationType.MEMBER_CREATED,
  NotificationType.MOVEMENT_CREATED,
  NotificationType.MOVEMENT_VOIDED,
  NotificationType.PAYMENT_MADE,
] as const;

export type SubscriberNotificationType =
  (typeof SubscriberNotificationTypes)[number];

export const NotificationTypeLabel = {
  [NotificationType.DUE_CREATED]: 'Deuda creada',
  [NotificationType.MEMBER_CREATED]: 'Socio creado',
  [NotificationType.MOVEMENT_CREATED]: 'Movimiento creado',
  [NotificationType.MOVEMENT_VOIDED]: 'Movimiento anulado',
  [NotificationType.PAYMENT_MADE]: 'Pago realizado',
} as const;

/**
 * Maps NotificationType to the corresponding user notification preference key.
 * Used to check if a user has opted in/out of a specific notification type.
 */
export const NotificationTypeToPreferenceKey = {
  [NotificationType.DUE_CREATED]: 'notifyOnDueCreated',
  [NotificationType.MEMBER_CREATED]: 'notifyOnMemberCreated',
  [NotificationType.MOVEMENT_CREATED]: 'notifyOnMovementCreated',
  [NotificationType.MOVEMENT_VOIDED]: 'notifyOnMovementVoided',
  [NotificationType.PAYMENT_MADE]: 'notifyOnPaymentMade',
} as const;

export type NotificationPreferenceKey =
  (typeof NotificationTypeToPreferenceKey)[NotificationType];

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
