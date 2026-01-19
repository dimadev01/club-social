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

  private constructor(props: MemberNotificationProps) {
    this.notifyOnDueCreated = props.notifyOnDueCreated;
    this.notifyOnPaymentMade = props.notifyOnPaymentMade;
  }

  public static raw(
    props?: null | Partial<MemberNotificationProps>,
  ): MemberNotification {
    return new MemberNotification({
      ...DEFAULT_MEMBER_NOTIFICATION,
      ...props,
    });
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
