import { ValueObject } from '@/shared/domain/value-objects/value-object.base';

export interface MemberNotificationProps {
  notifyOnDueCreated: boolean;
  notifyOnPaymentMade: boolean;
}

export const DEFAULT_MEMBER_NOTIFICATION = {
  notifyOnDueCreated: true,
  notifyOnPaymentMade: true,
} satisfies MemberNotificationProps;

export class MemberNotification extends ValueObject<MemberNotificationProps> {
  public get notifyOnDueCreated(): boolean {
    return this.props.notifyOnDueCreated;
  }

  public get notifyOnPaymentMade(): boolean {
    return this.props.notifyOnPaymentMade;
  }

  private constructor(props: MemberNotificationProps) {
    super(props);
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
      notifyOnDueCreated: this.props.notifyOnDueCreated,
      notifyOnPaymentMade: this.props.notifyOnPaymentMade,
    };
  }

  public toString(): string {
    return JSON.stringify(this.props);
  }

  public update(partial: Partial<MemberNotificationProps>): MemberNotification {
    const defined = Object.fromEntries(
      Object.entries(partial).filter(([, v]) => v !== undefined),
    );

    return new MemberNotification({
      ...DEFAULT_MEMBER_NOTIFICATION,
      ...this.props,
      ...defined,
    });
  }
}
