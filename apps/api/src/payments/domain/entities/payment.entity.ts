import { Decimal } from '@prisma/client/runtime/client';

import type { BaseEntityProps } from '@/shared/domain/entity';

import { Entity } from '@/shared/domain/entity';
import { ok, Result } from '@/shared/domain/result';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { PaymentCreatedEvent } from '../events/payment-created.event';
import { PaymentUpdatedEvent } from '../events/payment-updated.event';
import { UpdatePaymentProps } from '../interfaces/payment.interface';

interface PaymentProps {
  amount: Decimal;
  createdBy: string;
  date: Date;
  dueId: UniqueId;
  notes: null | string;
}

export class PaymentEntity extends Entity<PaymentEntity> {
  public get amount(): Decimal {
    return this._amount;
  }

  public get date(): Date {
    return this._date;
  }

  public get dueId(): UniqueId {
    return this._dueId;
  }

  public get notes(): null | string {
    return this._notes;
  }

  private _amount: Decimal;
  private _date: Date;
  private _dueId: UniqueId;
  private _notes: null | string;

  private constructor(props: PaymentProps, base?: BaseEntityProps) {
    super(base);

    this._amount = props.amount;
    this._date = props.date;
    this._dueId = props.dueId;
    this._notes = props.notes;
    this._createdBy = props.createdBy;
  }

  public static create(props: PaymentProps): Result<PaymentEntity> {
    const payment = new PaymentEntity(props);

    payment.addEvent(new PaymentCreatedEvent(payment));

    return ok(payment);
  }

  public static fromPersistence(
    props: PaymentProps,
    base: BaseEntityProps,
  ): PaymentEntity {
    return new PaymentEntity(props, base);
  }

  public update(props: UpdatePaymentProps): void {
    this._amount = props.amount;
    this._date = props.date;
    this._notes = props.notes;
    this.markAsUpdated(props.updatedBy);

    this.addEvent(new PaymentUpdatedEvent(this));
  }
}
