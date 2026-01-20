export interface UserNotificationProps {
  notifyOnDueCreated: boolean;
  notifyOnMemberCreated: boolean;
  notifyOnMovementCreated: boolean;
  notifyOnMovementVoided: boolean;
  notifyOnPaymentCreated: boolean;
}

export const DEFAULT_USER_NOTIFICATION = {
  notifyOnDueCreated: false,
  notifyOnMemberCreated: false,
  notifyOnMovementCreated: false,
  notifyOnMovementVoided: false,
  notifyOnPaymentCreated: false,
} satisfies UserNotificationProps;

/**
 * Default notification preferences for members.
 * Members default to receiving notifications about their own account activity.
 */
export const DEFAULT_MEMBER_USER_NOTIFICATION: UserNotificationProps = {
  notifyOnDueCreated: true,
  notifyOnMemberCreated: false,
  notifyOnMovementCreated: false,
  notifyOnMovementVoided: false,
  notifyOnPaymentCreated: true,
};

export class UserNotification {
  public readonly notifyOnDueCreated: boolean;
  public readonly notifyOnMemberCreated: boolean;
  public readonly notifyOnMovementCreated: boolean;
  public readonly notifyOnMovementVoided: boolean;
  public readonly notifyOnPaymentCreated: boolean;

  private constructor(props?: Partial<UserNotificationProps>) {
    this.notifyOnMemberCreated =
      props?.notifyOnMemberCreated ??
      DEFAULT_USER_NOTIFICATION.notifyOnMemberCreated;
    this.notifyOnMovementCreated =
      props?.notifyOnMovementCreated ??
      DEFAULT_USER_NOTIFICATION.notifyOnMovementCreated;
    this.notifyOnMovementVoided =
      props?.notifyOnMovementVoided ??
      DEFAULT_USER_NOTIFICATION.notifyOnMovementVoided;
    this.notifyOnPaymentCreated =
      props?.notifyOnPaymentCreated ??
      DEFAULT_USER_NOTIFICATION.notifyOnPaymentCreated;
    this.notifyOnDueCreated =
      props?.notifyOnDueCreated ?? DEFAULT_USER_NOTIFICATION.notifyOnDueCreated;
  }

  /**
   * Creates notification preferences with member defaults.
   * Use this when creating a new member user.
   */
  public static forMember(
    props?: Partial<UserNotificationProps>,
  ): UserNotification {
    return new UserNotification({
      ...DEFAULT_MEMBER_USER_NOTIFICATION,
      ...props,
    });
  }

  public static forUser(
    props?: Partial<UserNotificationProps>,
  ): UserNotification {
    return new UserNotification({
      ...DEFAULT_USER_NOTIFICATION,
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

  public toString(): string {
    return JSON.stringify(this.toJson());
  }

  public update(partial: Partial<UserNotificationProps>): UserNotification {
    const defined = Object.fromEntries(
      Object.entries(partial).filter(([, v]) => v !== undefined),
    );

    return new UserNotification({
      ...DEFAULT_USER_NOTIFICATION,
      ...this.toJson(),
      ...defined,
    });
  }
}
