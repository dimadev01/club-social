import { ok, Result } from '@/shared/domain/result';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

interface PaymentDueProps {
  amount: Amount;
  dueId: UniqueId;
  paymentId: UniqueId;
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

  private _amount: Amount;
  private _dueId: UniqueId;
  private _paymentId: UniqueId;

  private constructor(props: PaymentDueProps) {
    this._amount = props.amount;
    this._dueId = props.dueId;
    this._paymentId = props.paymentId;
  }

  public static create(props: PaymentDueProps): Result<PaymentDueEntity> {
    const paymentDue = new PaymentDueEntity({
      amount: props.amount,
      dueId: props.dueId,
      paymentId: props.paymentId,
    });

    return ok(paymentDue);
  }

  public static fromPersistence(props: PaymentDueProps): PaymentDueEntity {
    return new PaymentDueEntity(props);
  }
}
