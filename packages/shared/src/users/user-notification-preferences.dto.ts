export type UpdateUserNotificationPreferencesDto =
  Partial<UserNotificationPreferencesDto>;

export interface UserNotificationPreferencesDto {
  notifyOnDueCreated: boolean;
  notifyOnMemberCreated: boolean;
  notifyOnMovementCreated: boolean;
  notifyOnMovementVoided: boolean;
  notifyOnPaymentMade: boolean;
}
