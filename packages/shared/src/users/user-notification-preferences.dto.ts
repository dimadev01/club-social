/**
 * Notification preferences for admin users.
 * Currently empty - future system notifications will go here.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AdminNotificationPreferencesDto {}

/**
 * Notification preferences for staff users.
 * Staff can subscribe to all entity creation/update notifications.
 */
export interface StaffNotificationPreferencesDto {
  notifyOnDueCreated: boolean;
  notifyOnMemberCreated: boolean;
  notifyOnMovementCreated: boolean;
  notifyOnMovementVoided: boolean;
  notifyOnPaymentCreated: boolean;
}

export type UpdateUserNotificationPreferencesDto =
  Partial<UserNotificationPreferencesDto>;

export interface UserNotificationPreferencesDto {
  notifyOnDueCreated: boolean;
  notifyOnMemberCreated: boolean;
  notifyOnMovementCreated: boolean;
  notifyOnMovementVoided: boolean;
  notifyOnPaymentCreated: boolean;
}
