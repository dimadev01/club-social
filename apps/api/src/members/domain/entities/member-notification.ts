export interface MemberNotificationProps {
  notifyOnDueCreated: boolean;
  notifyOnPaymentMade: boolean;
}

export const DEFAULT_MEMBER_NOTIFICATION = {
  notifyOnDueCreated: true,
  notifyOnPaymentMade: true,
} satisfies MemberNotificationProps;

export class MemberNotification {
  public readonly notifyOnDueCreated: boolean;
  public readonly notifyOnPaymentMade: boolean;

  public constructor(props?: Partial<MemberNotificationProps>) {
    this.notifyOnDueCreated =
      props?.notifyOnDueCreated ??
      DEFAULT_MEMBER_NOTIFICATION.notifyOnDueCreated;
    this.notifyOnPaymentMade =
      props?.notifyOnPaymentMade ??
      DEFAULT_MEMBER_NOTIFICATION.notifyOnPaymentMade;
  }

  public toJson(): MemberNotificationProps {
    return {
      notifyOnDueCreated: this.notifyOnDueCreated,
      notifyOnPaymentMade: this.notifyOnPaymentMade,
    };
  }

  public toString(): string {
    return JSON.stringify(this.toJson());
  }

  public update(partial: Partial<MemberNotificationProps>): MemberNotification {
    const defined = Object.fromEntries(
      Object.entries(partial).filter(([, v]) => v !== undefined),
    );

    return new MemberNotification({
      ...DEFAULT_MEMBER_NOTIFICATION,
      ...this.toJson(),
      ...defined,
    });
  }
}
