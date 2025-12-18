import { DueCategory, DueStatus } from '@club-social/shared/dues';

import type { BaseEntityProps } from '@/shared/domain/entity';

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
    this._status = props.status;
    this._voidReason = props.voidReason;
    this._voidedAt = props.voidedAt;
    this._voidedBy = props.voidedBy;
    this._createdBy = props.createdBy;
  }

  public static create(
    props: Omit<DueProps, 'status' | 'voidedAt' | 'voidedBy' | 'voidReason'>,
  ): Result<DueEntity> {
    const due = new DueEntity({
      amount: props.amount,
      category: props.category,
      createdBy: props.createdBy,
      date: props.date,
      memberId: props.memberId,
      notes: props.notes,
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

  public isPaid(): boolean {
    return this._status === DueStatus.PAID;
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

    this._amount = props.amount;
    this._notes = props.notes;
    this.markAsUpdated(props.updatedBy);

    this.addEvent(new DueUpdatedEvent(this));

    return ok();
  }

  public updateStatus(status: DueStatus, updatedBy: string): void {
    this._status = status;
    this.markAsUpdated(updatedBy);

    this.addEvent(new DueUpdatedEvent(this));
  }

  public void(props: VoidDueProps): void {
    this._status = DueStatus.VOIDED;
    this._voidReason = props.voidReason;
    this._voidedAt = new Date();
    this._voidedBy = props.voidedBy;
    this.markAsUpdated(props.voidedBy);

    this.addEvent(new DueUpdatedEvent(this));
  }
}
