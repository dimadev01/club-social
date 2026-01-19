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

  private constructor(props: UserNotificationProps) {
    this.notifyOnMovementCreated = props.notifyOnMovementCreated;
    this.notifyOnMovementVoided = props.notifyOnMovementVoided;
    this.notifyOnMemberCreated = props.notifyOnMemberCreated;
    this.notifyOnDueOverdue = props.notifyOnDueOverdue;
  }

  public static raw(
    props?: null | Partial<UserNotificationProps>,
  ): UserNotification {
    return new UserNotification({
      ...DEFAULT_USER_NOTIFICATION,
      ...props,
    });
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
