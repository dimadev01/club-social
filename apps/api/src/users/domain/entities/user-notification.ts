export interface UserNotificationProps {
  notifyOnDueOverdue: boolean;
  notifyOnMemberCreated: boolean;
  notifyOnMovementCreated: boolean;
  notifyOnMovementVoided: boolean;
}

export const DEFAULT_USER_NOTIFICATION = {
  notifyOnDueOverdue: false,
  notifyOnMemberCreated: false,
  notifyOnMovementCreated: false,
  notifyOnMovementVoided: false,
} satisfies UserNotificationProps;

export class UserNotification {
  public readonly notifyOnDueOverdue: boolean;
  public readonly notifyOnMemberCreated: boolean;
  public readonly notifyOnMovementCreated: boolean;
  public readonly notifyOnMovementVoided: boolean;

  public constructor(props?: Partial<UserNotificationProps>) {
    this.notifyOnDueOverdue =
      props?.notifyOnDueOverdue ?? DEFAULT_USER_NOTIFICATION.notifyOnDueOverdue;
    this.notifyOnMemberCreated =
      props?.notifyOnMemberCreated ??
      DEFAULT_USER_NOTIFICATION.notifyOnMemberCreated;
    this.notifyOnMovementCreated =
      props?.notifyOnMovementCreated ??
      DEFAULT_USER_NOTIFICATION.notifyOnMovementCreated;
    this.notifyOnMovementVoided =
      props?.notifyOnMovementVoided ??
      DEFAULT_USER_NOTIFICATION.notifyOnMovementVoided;
  }

  public toJson(): UserNotificationProps {
    return {
      notifyOnDueOverdue: this.notifyOnDueOverdue,
      notifyOnMemberCreated: this.notifyOnMemberCreated,
      notifyOnMovementCreated: this.notifyOnMovementCreated,
      notifyOnMovementVoided: this.notifyOnMovementVoided,
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
