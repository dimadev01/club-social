import { DueCategory, DueStatus } from '@club-social/shared/dues';

import { BaseEntityProps, Entity } from '@/shared/domain/entity';
import { ApplicationError } from '@/shared/domain/errors/application.error';
import { err, ok, Result } from '@/shared/domain/result';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import { StrictOmit } from '@/shared/types/type-utils';

import { VoidDueProps } from '../interfaces/due.interface';
import { DueSettlementEntity } from './due-settlement.entity';

interface DueProps {
  amount: Amount;
  category: DueCategory;
  createdBy: string;
  date: DateOnly;
  memberId: UniqueId;
  notes: null | string;
  settlements: DueSettlementEntity[];
  status: DueStatus;
}

export class DueEntity2 extends Entity<DueEntity2> {
  public get outstandingAmount(): Amount {
    const remaining = this._amount.subtract(this.settledAmount);

    if (remaining.isErr()) {
      throw new ApplicationError('Error calculating outstanding amount');
    }

    return remaining.value.isLessThan(Amount.raw({ cents: 0 }))
      ? Amount.raw({ cents: 0 })
      : remaining.value;
  }

  public get settledAmount(): Amount {
    return this._settlements
      .filter((s) => s.isActive())
      .reduce((sum, s) => sum.add(s.amount), Amount.raw({ cents: 0 }));
  }

  public get settlements(): DueSettlementEntity[] {
    return [...this._settlements];
  }

  private _amount: Amount;
  private _category: DueCategory;
  private _date: DateOnly;
  private _memberId: UniqueId;
  private _notes: null | string;
  private _settlements: DueSettlementEntity[];
  private _status: DueStatus;

  private constructor(props: DueProps, base?: BaseEntityProps) {
    super(base);

    this._amount = props.amount;
    this._category = props.category;
    this._date = props.date;
    this._memberId = props.memberId;
    this._notes = props.notes;
    this._status = props.status;
    this._createdBy = props.createdBy;
    this._updatedBy = props.createdBy;
  }

  public static create(
    props: StrictOmit<DueProps, 'settlements' | 'status'>,
  ): Result<DueEntity2> {
    const due = new DueEntity2({
      amount: props.amount,
      category: props.category,
      createdBy: props.createdBy,
      date: props.date,
      memberId: props.memberId,
      notes: props.notes,
      settlements: [],
      status: DueStatus.PENDING,
    });

    // due.addEvent(new DueCreatedEvent(due));

    return ok(due);
  }

  public static fromPersistence(
    props: DueProps,
    base: BaseEntityProps,
  ): DueEntity2 {
    return new DueEntity2(props, base);
  }

  public applySettlement(
    ledgerEntryId: UniqueId,
    amount: Amount,
    createdBy: string,
  ): Result<void> {
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

    if (amount.isNegative()) {
      return err(new ApplicationError('El monto a imputar debe ser positivo'));
    }

    // enforce: settled + amount <= due.amount
    if (this.settledAmount.add(amount).isGreaterThan(this._amount)) {
      return err(
        new ApplicationError('El monto imputado excede el total de la cuota'),
      );
    }

    const settlementResult = DueSettlementEntity.create({
      amount,
      dueId: this.id,
      ledgerEntryId,
    });

    if (settlementResult.isErr()) {
      return err(settlementResult.error);
    }

    this._settlements.push(settlementResult.value);

    // optionally add an event: new DueSettlementAppliedEvent(...)
    this.recalculateStatusInternal(createdBy);

    return ok();
  }

  public clone(): DueEntity2 {
    return DueEntity2.fromPersistence(
      {
        amount: this._amount,
        category: this._category,
        createdBy: this._createdBy,
        date: this._date,
        memberId: this._memberId,
        notes: this._notes,
        settlements: [...this._settlements],
        status: this._status,
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

  public isPending(): boolean {
    return this._status === DueStatus.PENDING;
  }

  public isVoided(): boolean {
    return this._status === DueStatus.VOIDED;
  }

  public reverseByLedgerEntry(
    ledgerEntryId: UniqueId,
    reversedBy: string,
  ): Result<void> {
    const affected = this._settlements.filter(
      (s) => s.ledgerEntryId.equals(ledgerEntryId) && s.isActive(),
    );

    if (affected.length === 0) {
      return err(
        new ApplicationError(
          'No se encontraron imputaciones activas para ese movimiento',
        ),
      );
    }

    affected.forEach((s) => s.void());
    this.recalculateStatusInternal(reversedBy);

    return ok();
  }

  public reverseSettlement(
    settlementId: UniqueId,
    reversedBy: string,
  ): Result<void> {
    const settlement = this._settlements.find(
      (s) => s.id.equals(settlementId) && s.isActive(),
    );

    if (!settlement) {
      return err(
        new ApplicationError('No se encontró un settlement activo para anular'),
      );
    }

    settlement.void();
    this.recalculateStatusInternal(reversedBy);

    return ok();
  }

  public void(props: VoidDueProps): Result<void> {
    // recommended rule change: allow void only if no active settlements
    if (this.settledAmount.isPositive()) {
      return err(
        new ApplicationError(
          'No se puede anular una cuota con pagos imputados',
        ),
      );
    }

    if (!this.isPending()) {
      return err(
        new ApplicationError('Solo se pueden anular cuotas pendientes'),
      );
    }

    // const oldDue = this.clone();
    this._status = DueStatus.VOIDED;
    this.markAsUpdated(props.voidedBy);
    // this.addEvent(new DueUpdatedEvent(oldDue, this));

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
      // const oldDue = this.clone();
      this._status = newStatus;
      this.markAsUpdated(updatedBy);
      // this.addEvent(new DueUpdatedEvent(oldDue, this));
    }
  }
}
