import { PaymentStatus } from '@club-social/shared/payments';

import type { BaseEntityProps } from '@/shared/domain/entity';

import { Entity } from '@/shared/domain/entity';
import { ApplicationError } from '@/shared/domain/errors/application.error';
import { err, ok, Result, ResultUtils } from '@/shared/domain/result';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { PaymentCreatedEvent } from '../events/payment-created.event';
import { PaymentUpdatedEvent } from '../events/payment-updated.event';
import {
  CreatePaymentProps,
  UpdatePaymentProps,
  VoidPaymentProps,
} from '../payment.interface';
import { PaymentDueEntity } from './payment-due.entity';

interface PaymentProps {
  amount: Amount;
  createdBy: string;
  date: DateOnly;
  notes: null | string;
  paymentDues: PaymentDueEntity[];
  status: PaymentStatus;
  voidedAt: Date | null;
  voidedBy: null | string;
  voidReason: null | string;
}

export class PaymentEntity extends Entity<PaymentEntity> {
  public get affectedDueIds(): UniqueId[] {
    return this._paymentDues.map((pd) => pd.dueId);
  }

  public get amount(): Amount {
    return this._amount;
  }

  public get date(): DateOnly {
    return this._date;
  }

  public get notes(): null | string {
    return this._notes;
  }

  public get paymentDues(): PaymentDueEntity[] {
    return [...this._paymentDues];
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
  private _notes: null | string;
  private _paymentDues: PaymentDueEntity[];
  private _status: PaymentStatus;
  private _voidedAt: Date | null;
  private _voidedBy: null | string;
  private _voidReason: null | string;

  private constructor(props: PaymentProps, base?: BaseEntityProps) {
    super(base);

    this._amount = props.amount;
    this._date = props.date;
    this._notes = props.notes;
    this._paymentDues = props.paymentDues;
    this._status = props.status;
    this._voidedAt = props.voidedAt;
    this._voidedBy = props.voidedBy;
    this._voidReason = props.voidReason;
  }

  public static create(props: CreatePaymentProps): Result<PaymentEntity> {
    if (props.paymentDues.length === 0) {
      return err(
        new ApplicationError('El pago debe tener al menos una cuota asociada'),
      );
    }

    const paymentId = UniqueId.generate();

    const paymentDuesResults = ResultUtils.combine(
      props.paymentDues.map((pd) =>
        PaymentDueEntity.create({
          amount: pd.amount,
          dueId: pd.dueId,
          paymentId: paymentId,
        }),
      ),
    );

    if (paymentDuesResults.isErr()) {
      return err(paymentDuesResults.error);
    }

    const paymentDues = paymentDuesResults.value;

    const totalAmount = paymentDues.reduce(
      (sum, pd) => sum.add(pd.amount),
      Amount.raw({ cents: 0 }),
    );

    const payment = new PaymentEntity(
      {
        amount: totalAmount,
        createdBy: props.createdBy,
        date: props.date,
        notes: props.notes,
        paymentDues: paymentDues,
        status: PaymentStatus.PAID,
        voidedAt: null,
        voidedBy: null,
        voidReason: null,
      },
      {
        createdAt: new Date(),
        createdBy: props.createdBy,
        deletedAt: null,
        deletedBy: null,
        id: paymentId,
        updatedAt: new Date(),
        updatedBy: props.createdBy,
      },
    );

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

  public update(props: UpdatePaymentProps): Result<void> {
    if (this.isVoided()) {
      return err(new ApplicationError('No se puede editar un pago anulado'));
    }

    if (props.paymentDues.length === 0) {
      return err(
        new ApplicationError('El pago debe tener al menos una cuota asociada'),
      );
    }

    const paymentDues: PaymentDueEntity[] = [];

    for (const pd of props.paymentDues) {
      const result = PaymentDueEntity.create({
        amount: pd.amount,
        dueId: pd.dueId,
        paymentId: this.id,
      });

      if (result.isErr()) {
        return err(result.error);
      }

      paymentDues.push(result.value);
    }

    const totalAmount = paymentDues.reduce(
      (sum, pd) => sum.add(pd.amount),
      Amount.raw({ cents: 0 }),
    );

    this._date = props.date;
    this._notes = props.notes;
    this._paymentDues = paymentDues;
    this._amount = totalAmount;
    this.markAsUpdated(props.updatedBy);

    this.addEvent(new PaymentUpdatedEvent(this));

    return ok();
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
