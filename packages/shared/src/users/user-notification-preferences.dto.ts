export type UpdateUserNotificationPreferencesDto = Partial<{
  notifyOnDueCreated: boolean;
  notifyOnMemberCreated: boolean;
  notifyOnMovementCreated: boolean;
  notifyOnMovementVoided: boolean;
  notifyOnPaymentMade: boolean;
}>;

export interface UserNotificationPreferencesDto {
  notifyOnDueCreated: boolean;
  notifyOnMemberCreated: boolean;
  notifyOnMovementCreated: boolean;
  notifyOnMovementVoided: boolean;
  notifyOnPaymentMade: boolean;
}
