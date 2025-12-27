import { DueCategory, DueStatus } from '@club-social/shared/dues';

import { AuditedAggregateRoot } from '@/shared/domain/audited-aggregate-root';
import { ApplicationError } from '@/shared/domain/errors/application.error';
import { PersistenceMeta } from '@/shared/domain/persistence-meta';
import { err, ok, Result } from '@/shared/domain/result';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { DueCreatedEvent } from '../events/due-created.event';
import { DueUpdatedEvent } from '../events/due-updated.event';
import { UpdateDueProps, VoidDueProps } from '../interfaces/due.interface';
import { DueSettlementEntity } from './due-settlement.entity';

interface DueProps {
  amount: Amount;
  category: DueCategory;
  date: DateOnly;
  memberId: UniqueId;
  notes: null | string;
  settlements: DueSettlementEntity[];
  status: DueStatus;
  voidedAt: Date | null;
  voidedBy: null | string;
  voidReason: null | string;
}

export class DueEntity extends AuditedAggregateRoot {
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

  public get settledAmount(): Amount {
    return this._settlements
      .filter((s) => s.isApplied())
      .reduce((sum, s) => sum.add(s.amount), Amount.raw({ cents: 0 }));
  }

  public get settlements(): DueSettlementEntity[] {
    return [...this._settlements];
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
  private _settlements: DueSettlementEntity[];
  private _status: DueStatus;
  private _voidedAt: Date | null;
  private _voidedBy: null | string;
  private _voidReason: null | string;

  private constructor(props: DueProps, meta?: PersistenceMeta) {
    super(meta?.id, meta?.audit);

    this._amount = props.amount;
    this._category = props.category;
    this._date = props.date;
    this._memberId = props.memberId;
    this._notes = props.notes;
    this._settlements = props.settlements;
    this._status = props.status;
    this._voidReason = props.voidReason;
    this._voidedAt = props.voidedAt;
    this._voidedBy = props.voidedBy;
  }

  public static create(
    props: Omit<
      DueProps,
      'settlements' | 'status' | 'voidedAt' | 'voidedBy' | 'voidReason'
    >,
    createdBy: string,
  ): Result<DueEntity> {
    const due = new DueEntity(
      {
        amount: props.amount,
        category: props.category,
        date: props.date,
        memberId: props.memberId,
        notes: props.notes,
        settlements: [],
        status: DueStatus.PENDING,
        voidedAt: null,
        voidedBy: null,
        voidReason: null,
      },
      {
        audit: { createdBy },
        id: UniqueId.generate(),
      },
    );

    due.addEvent(new DueCreatedEvent(due));

    return ok(due);
  }

  public static fromPersistence(
    props: DueProps,
    meta: PersistenceMeta,
  ): DueEntity {
    return new DueEntity(props, meta);
  }

  public applySettlement(params: {
    amount: Amount;
    createdBy: string;
    memberLedgerEntryId: UniqueId;
    paymentId: UniqueId;
  }): Result<void> {
    if (this.isVoided()) {
      return err(
        new ApplicationError('No se puede imputar un pago a una cuota anulada'),
      );
    }

    if (this.isPaid()) {
      return err(
        new ApplicationError('No se puede imputar un pago a una cuota ya paga'),
      );
    }

    if (params.amount.isNegative()) {
      return err(new ApplicationError('El monto a imputar debe ser positivo'));
    }

    if (this.settledAmount.add(params.amount).isGreaterThan(this._amount)) {
      return err(
        new ApplicationError('El monto imputado excede el total de la cuota'),
      );
    }

    const dueSettlement = DueSettlementEntity.create({
      amount: params.amount,
      dueId: this.id,
      memberLedgerEntryId: params.memberLedgerEntryId,
      paymentId: params.paymentId,
    });

    if (dueSettlement.isErr()) {
      return err(dueSettlement.error);
    }

    this._settlements.push(dueSettlement.value);

    this.recalculateStatusInternal(params.createdBy);

    return ok();
  }

  public clone(): DueEntity {
    return DueEntity.fromPersistence(
      {
        amount: this._amount,
        category: this._category,
        date: this._date,
        memberId: this._memberId,
        notes: this._notes,
        settlements: [...this._settlements],
        status: this._status,
        voidedAt: this._voidedAt,
        voidedBy: this._voidedBy,
        voidReason: this._voidReason,
      },
      {
        audit: { ...this._audit },
        id: this.id,
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

  private recalculateStatusInternal(updatedBy = 'System'): void {
    const totalSettled = this.settledAmount;

    let newStatus: DueStatus;

    if (totalSettled.isGreaterThanOrEqual(this._amount)) {
      newStatus = DueStatus.PAID;
    } else if (totalSettled.isGreaterThan(Amount.raw({ cents: 0 }))) {
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
