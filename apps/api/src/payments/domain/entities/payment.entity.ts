import { PaymentStatus } from '@club-social/shared/payments';

import type { BaseEntityProps } from '@/shared/domain/entity';

import { Entity } from '@/shared/domain/entity';
import { ApplicationError } from '@/shared/domain/errors/application.error';
import { err, ok, Result } from '@/shared/domain/result';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { PaymentCreatedEvent } from '../events/payment-created.event';
import { PaymentUpdatedEvent } from '../events/payment-updated.event';
import {
  UpdatePaymentProps,
  VoidPaymentProps,
} from '../interfaces/payment.interface';

interface PaymentProps {
  amount: Amount;
  createdBy: string;
  date: DateOnly;
  dueId: UniqueId;
  notes: null | string;
  status: PaymentStatus;
  voidedAt: Date | null;
  voidedBy: null | string;
  voidReason: null | string;
}

export class PaymentEntity extends Entity<PaymentEntity> {
  public get amount(): Amount {
    return this._amount;
  }

  public get date(): DateOnly {
    return this._date;
  }

  public get dueId(): UniqueId {
    return this._dueId;
  }

  public get notes(): null | string {
    return this._notes;
  }

  public get status(): PaymentStatus {
    return this._status;
  }

  public get voidedAt(): Date | null {
    return this._voidedAt;
  }

  public get voidedBy(): null | string {
    return this._voidedBy;
  }

  public get voidReason(): null | string {
    return this._voidReason;
  }

  private _amount: Amount;
  private _date: DateOnly;
  private _dueId: UniqueId;
  private _notes: null | string;
  private _status: PaymentStatus;
  private _voidedAt: Date | null;
  private _voidedBy: null | string;
  private _voidReason: null | string;

  private constructor(props: PaymentProps, base?: BaseEntityProps) {
    super(base);

    this._amount = props.amount;
    this._date = props.date;
    this._dueId = props.dueId;
    this._notes = props.notes;
    this._createdBy = props.createdBy;
    this._status = props.status;
    this._voidedAt = props.voidedAt;
    this._voidedBy = props.voidedBy;
    this._voidReason = props.voidReason;
  }

  public static create(
    props: Omit<
      PaymentProps,
      'status' | 'voidedAt' | 'voidedBy' | 'voidReason'
    >,
  ): Result<PaymentEntity> {
    const payment = new PaymentEntity({
      amount: props.amount,
      createdBy: props.createdBy,
      date: props.date,
      dueId: props.dueId,
      notes: props.notes,
      status: PaymentStatus.PAID,
      voidedAt: null,
      voidedBy: null,
      voidReason: null,
    });

    payment.addEvent(new PaymentCreatedEvent(payment));

    return ok(payment);
  }

  public static fromPersistence(
    props: PaymentProps,
    base: BaseEntityProps,
  ): PaymentEntity {
    return new PaymentEntity(props, base);
  }

  public isPaid(): boolean {
    return this._status === PaymentStatus.PAID;
  }

  public isVoided(): boolean {
    return this._status === PaymentStatus.VOIDED;
  }

  public update(props: UpdatePaymentProps): void {
    this._amount = props.amount;
    this._date = props.date;
    this._notes = props.notes;
    this.markAsUpdated(props.updatedBy);

    this.addEvent(new PaymentUpdatedEvent(this));
  }

  public void(props: VoidPaymentProps): Result<void> {
    if (this.isVoided()) {
      return err(new ApplicationError('No se puede anular un pago anulado'));
    }

    this._status = PaymentStatus.VOIDED;
    this._voidReason = props.voidReason;
    this._voidedAt = new Date();
    this._voidedBy = props.voidedBy;
    this.markAsUpdated(props.voidedBy);
    this.addEvent(new PaymentUpdatedEvent(this));

    return ok();
  }
}
