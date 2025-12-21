import { PaymentDueStatus } from '@club-social/shared/payments';

import { ok, Result } from '@/shared/domain/result';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

interface PaymentDueProps {
  amount: Amount;
  dueId: UniqueId;
  paymentId: UniqueId;
  status: PaymentDueStatus;
}

export class PaymentDueEntity {
  public get amount(): Amount {
    return this._amount;
  }

  public get dueId(): UniqueId {
    return this._dueId;
  }

  public get paymentId(): UniqueId {
    return this._paymentId;
  }

  public get status(): PaymentDueStatus {
    return this._status;
  }

  private _amount: Amount;
  private _dueId: UniqueId;
  private _paymentId: UniqueId;
  private _status: PaymentDueStatus;

  private constructor(props: PaymentDueProps) {
    this._amount = props.amount;
    this._dueId = props.dueId;
    this._paymentId = props.paymentId;
    this._status = props.status;
  }

  public static create(
    props: Omit<PaymentDueProps, 'status'>,
  ): Result<PaymentDueEntity> {
    const paymentDue = new PaymentDueEntity({
      amount: props.amount,
      dueId: props.dueId,
      paymentId: props.paymentId,
      status: PaymentDueStatus.ACTIVE,
    });

    return ok(paymentDue);
  }

  public static fromPersistence(props: PaymentDueProps): PaymentDueEntity {
    return new PaymentDueEntity(props);
  }

  public isActive(): boolean {
    return this._status === PaymentDueStatus.ACTIVE;
  }

  public isVoided(): boolean {
    return this._status === PaymentDueStatus.VOIDED;
  }

  public void(): void {
    this._status = PaymentDueStatus.VOIDED;
  }
}
