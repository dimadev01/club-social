import { DueCategory, DueStatus } from '@club-social/shared/dues';

import type { BaseEntityProps } from '@/shared/domain/entity';

import { PaymentDueEntity } from '@/payments/domain/entities/payment-due.entity';
import { Entity } from '@/shared/domain/entity';
import { ApplicationError } from '@/shared/domain/errors/application.error';
import { err, ok, Result } from '@/shared/domain/result';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { DueCreatedEvent } from '../events/due-created.event';
import { DueUpdatedEvent } from '../events/due-updated.event';
import { UpdateDueProps, VoidDueProps } from '../interfaces/due.interface';

interface DueProps {
  amount: Amount;
  category: DueCategory;
  createdBy: string;
  date: DateOnly;
  memberId: UniqueId;
  notes: null | string;
  paymentDues: PaymentDueEntity[];
  status: DueStatus;
  voidedAt: Date | null;
  voidedBy: null | string;
  voidReason: null | string;
}

export class DueEntity extends Entity<DueEntity> {
  public get amount(): Amount {
    return this._amount;
  }

  public get category(): DueCategory {
    return this._category;
  }

  public get date(): DateOnly {
    return this._date;
  }

  public get memberId(): UniqueId {
    return this._memberId;
  }

  public get notes(): null | string {
    return this._notes;
  }

  public get paymentDues(): PaymentDueEntity[] {
    return [...this._paymentDues];
  }

  public get status(): DueStatus {
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
  private _category: DueCategory;
  private _date: DateOnly;
  private _memberId: UniqueId;
  private _notes: null | string;
  private _paymentDues: PaymentDueEntity[];
  private _status: DueStatus;
  private _voidedAt: Date | null;
  private _voidedBy: null | string;
  private _voidReason: null | string;

  private constructor(props: DueProps, base?: BaseEntityProps) {
    super(base);

    this._amount = props.amount;
    this._category = props.category;
    this._date = props.date;
    this._memberId = props.memberId;
    this._notes = props.notes;
    this._paymentDues = props.paymentDues;
    this._status = props.status;
    this._voidReason = props.voidReason;
    this._voidedAt = props.voidedAt;
    this._voidedBy = props.voidedBy;
    this._createdBy = props.createdBy;
    this._updatedBy = props.createdBy;
  }

  public static create(
    props: Omit<
      DueProps,
      'paymentDues' | 'status' | 'voidedAt' | 'voidedBy' | 'voidReason'
    >,
  ): Result<DueEntity> {
    const due = new DueEntity({
      amount: props.amount,
      category: props.category,
      createdBy: props.createdBy,
      date: props.date,
      memberId: props.memberId,
      notes: props.notes,
      paymentDues: [],
      status: DueStatus.PENDING,
      voidedAt: null,
      voidedBy: null,
      voidReason: null,
    });

    due.addEvent(new DueCreatedEvent(due));

    return ok(due);
  }

  public static fromPersistence(
    props: DueProps,
    base: BaseEntityProps,
  ): DueEntity {
    return new DueEntity(props, base);
  }

  public addPayment(
    paymentId: UniqueId,
    amount: Amount,
    createdBy: string,
  ): Result<void> {
    if (this.isVoided()) {
      return err(
        new ApplicationError('No se puede agregar un pago a una cuota anulada'),
      );
    }

    const paymentDueResult = PaymentDueEntity.create({
      amount,
      dueId: this.id,
      paymentId,
    });

    if (paymentDueResult.isErr()) {
      return err(paymentDueResult.error);
    }

    this._paymentDues.push(paymentDueResult.value);
    this.recalculateStatusInternal(createdBy);

    return ok();
  }

  public clone(): DueEntity {
    return DueEntity.fromPersistence(
      {
        amount: this._amount,
        category: this._category,
        createdBy: this._createdBy,
        date: this._date,
        memberId: this._memberId,
        notes: this._notes,
        paymentDues: [...this._paymentDues],
        status: this._status,
        voidedAt: this._voidedAt,
        voidedBy: this._voidedBy,
        voidReason: this._voidReason,
      },
      {
        createdAt: this._createdAt,
        createdBy: this._createdBy,
        deletedAt: this._deletedAt,
        deletedBy: this._deletedBy,
        id: this._id,
        updatedAt: this._updatedAt,
        updatedBy: this._updatedBy,
      },
    );
  }

  public isPaid(): boolean {
    return this._status === DueStatus.PAID;
  }

  public isPartiallyPaid(): boolean {
    return this._status === DueStatus.PARTIALLY_PAID;
  }

  public isPending(): boolean {
    return this._status === DueStatus.PENDING;
  }

  public isVoided(): boolean {
    return this._status === DueStatus.VOIDED;
  }

  public update(props: UpdateDueProps): Result<void> {
    if (this.isPaid()) {
      return err(new ApplicationError('No se puede editar una cuota paga'));
    }

    if (this.isVoided()) {
      return err(new ApplicationError('No se puede editar una cuota anulada'));
    }

    const oldDue = this.clone();

    this._amount = props.amount;
    this._notes = props.notes;
    this.markAsUpdated(props.updatedBy);

    this.addEvent(new DueUpdatedEvent(oldDue, this));

    return ok();
  }

  public void(props: VoidDueProps): Result<void> {
    if (!this.isPending()) {
      return err(
        new ApplicationError('Solo se pueden anular cuotas pendientes'),
      );
    }

    const oldDue = this.clone();

    this._status = DueStatus.VOIDED;
    this._voidReason = props.voidReason;
    this._voidedAt = new Date();
    this._voidedBy = props.voidedBy;
    this.markAsUpdated(props.voidedBy);
    this.addEvent(new DueUpdatedEvent(oldDue, this));

    return ok();
  }

  public voidPayment(paymentId: UniqueId, voidedBy: string): Result<void> {
    const affectedPaymentDues = this._paymentDues.filter(
      (pd) => pd.paymentId.equals(paymentId) && pd.isActive(),
    );

    if (affectedPaymentDues.length === 0) {
      return err(
        new ApplicationError('No se encontraron pagos activos para anular'),
      );
    }

    affectedPaymentDues.forEach((pd) => pd.void());
    this.recalculateStatusInternal(voidedBy);

    return ok();
  }

  private recalculateStatusInternal(updatedBy = 'System'): void {
    const totalPaid = this._paymentDues
      .filter((pd) => pd.isActive())
      .reduce((sum, pd) => sum.add(pd.amount), Amount.raw({ cents: 0 }));

    let newStatus: DueStatus;

    if (totalPaid.isGreaterThanOrEqual(this._amount)) {
      newStatus = DueStatus.PAID;
    } else if (totalPaid.isGreaterThan(Amount.raw({ cents: 0 }))) {
      newStatus = DueStatus.PARTIALLY_PAID;
    } else {
      newStatus = DueStatus.PENDING;
    }

    if (this._status !== newStatus) {
      const oldDue = this.clone();
      this._status = newStatus;
      this.markAsUpdated(updatedBy);
      this.addEvent(new DueUpdatedEvent(oldDue, this));
    }
  }
}
