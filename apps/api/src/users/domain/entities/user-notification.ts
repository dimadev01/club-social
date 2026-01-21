import {
  NotificationTypesByRole,
  NotificationTypeToPreferenceKey,
} from '@club-social/shared/notifications';
import { UserRole } from '@club-social/shared/users';

export interface UserNotificationProps {
  notifyOnDueCreated: boolean;
  notifyOnMemberCreated: boolean;
  notifyOnMovementCreated: boolean;
  notifyOnMovementVoided: boolean;
  notifyOnPaymentCreated: boolean;
}

/**
 * Base notification preferences with all fields set to false.
 */
const BASE_NOTIFICATION: UserNotificationProps = {
  notifyOnDueCreated: false,
  notifyOnMemberCreated: false,
  notifyOnMovementCreated: false,
  notifyOnMovementVoided: false,
  notifyOnPaymentCreated: false,
};

/**
 * Role-specific default overrides. Only specify what differs from BASE_NOTIFICATION.
 */
const DEFAULT_NOTIFICATION_OVERRIDES: Record<
  UserRole,
  Partial<UserNotificationProps>
> = {
  [UserRole.ADMIN]: {},
  [UserRole.MEMBER]: {
    notifyOnDueCreated: true,
    notifyOnPaymentCreated: true,
  },
  [UserRole.STAFF]: {},
};

/**
 * Map of role to notification preference keys that should be persisted.
 * Derived from the shared NotificationTypesByRole configuration.
 */
const NOTIFICATION_KEYS_BY_ROLE = Object.fromEntries(
  Object.values(UserRole).map((role) => [
    role,
    NotificationTypesByRole[role].map(
      (type) =>
        NotificationTypeToPreferenceKey[type] as keyof UserNotificationProps,
    ),
  ]),
) as Record<UserRole, (keyof UserNotificationProps)[]>;

export class UserNotification {
  public readonly notifyOnDueCreated: boolean;
  public readonly notifyOnMemberCreated: boolean;
  public readonly notifyOnMovementCreated: boolean;
  public readonly notifyOnMovementVoided: boolean;
  public readonly notifyOnPaymentCreated: boolean;

  private constructor(props: UserNotificationProps) {
    this.notifyOnDueCreated = props.notifyOnDueCreated;
    this.notifyOnMemberCreated = props.notifyOnMemberCreated;
    this.notifyOnMovementCreated = props.notifyOnMovementCreated;
    this.notifyOnMovementVoided = props.notifyOnMovementVoided;
    this.notifyOnPaymentCreated = props.notifyOnPaymentCreated;
  }

  /**
   * Creates notification preferences with role-specific defaults.
   * Use this when creating a new user or hydrating from persistence.
   */
  public static forRole(
    role: UserRole,
    props?: Partial<UserNotificationProps>,
  ): UserNotification {
    return new UserNotification({
      ...BASE_NOTIFICATION,
      ...DEFAULT_NOTIFICATION_OVERRIDES[role],
      ...props,
    });
  }

  public toJson(): UserNotificationProps {
    return {
      notifyOnDueCreated: this.notifyOnDueCreated,
      notifyOnMemberCreated: this.notifyOnMemberCreated,
      notifyOnMovementCreated: this.notifyOnMovementCreated,
      notifyOnMovementVoided: this.notifyOnMovementVoided,
      notifyOnPaymentCreated: this.notifyOnPaymentCreated,
    };
  }

  /**
   * Returns only the role-relevant fields for database storage.
   */
  public toJsonForRole(role: UserRole): Partial<UserNotificationProps> {
    const keys = NOTIFICATION_KEYS_BY_ROLE[role];

    return Object.fromEntries(
      keys.map((key) => [key, this[key]]),
    ) as Partial<UserNotificationProps>;
  }

  public toString(): string {
    return JSON.stringify(this.toJson());
  }

  public update(partial: Partial<UserNotificationProps>): UserNotification {
    const defined = Object.fromEntries(
      Object.entries(partial).filter(([, v]) => v !== undefined),
    );

    return new UserNotification({
      ...BASE_NOTIFICATION,
      ...this.toJson(),
      ...defined,
    });
  }
}
