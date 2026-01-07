import {
  MovementCategory,
  MovementMode,
  MovementStatus,
} from '@club-social/shared/movements';

import { AuditedAggregateRoot } from '@/shared/domain/audited-aggregate-root';
import { ApplicationError } from '@/shared/domain/errors/application.error';
import { PersistenceMeta } from '@/shared/domain/persistence-meta';
import { err, ok, Result } from '@/shared/domain/result';
import { SignedAmount } from '@/shared/domain/value-objects/amount/signed-amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import { StrictOmit } from '@/shared/types/type-utils';

import { MovementCreatedEvent } from '../events/movement-created.event';
import { MovementUpdatedEvent } from '../events/movement-updated.event';

export type CreateMovementProps = StrictOmit<
  MovementProps,
  'voidedAt' | 'voidedBy' | 'voidReason'
>;

export interface MovementProps {
  amount: SignedAmount;
  category: MovementCategory;
  date: DateOnly;
  mode: MovementMode;
  notes: null | string;
  paymentId: null | UniqueId;
  status: MovementStatus;
  voidedAt: Date | null;
  voidedBy: null | string;
  voidReason: null | string;
}

export class MovementEntity extends AuditedAggregateRoot {
  public get amount(): SignedAmount {
    return this._amount;
  }

  public get category(): MovementCategory {
    return this._category;
  }

  public get date(): DateOnly {
    return this._date;
  }

  public get mode(): MovementMode {
    return this._mode;
  }

  public get notes(): null | string {
    return this._notes;
  }

  public get paymentId(): null | UniqueId {
    return this._paymentId;
  }

  public get status(): MovementStatus {
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

  private _amount: SignedAmount;
  private _category: MovementCategory;
  private _date: DateOnly;
  private _mode: MovementMode;
  private _notes: null | string;
  private _paymentId: null | UniqueId;
  private _status: MovementStatus;
  private _voidedAt: Date | null;
  private _voidedBy: null | string;
  private _voidReason: null | string;

  private constructor(props: MovementProps, meta?: PersistenceMeta) {
    super(meta?.id, meta?.audit);

    this._amount = props.amount;
    this._category = props.category;
    this._date = props.date;
    this._notes = props.notes;
    this._mode = props.mode;
    this._paymentId = props.paymentId;
    this._status = props.status;
    this._voidReason = props.voidReason;
    this._voidedAt = props.voidedAt;
    this._voidedBy = props.voidedBy;
  }

  public static create(
    props: CreateMovementProps,
    createdBy: string,
  ): Result<MovementEntity> {
    const movement = new MovementEntity(
      {
        amount: props.amount,
        category: props.category,
        date: props.date,
        mode: props.mode,
        notes: props.notes,
        paymentId: props.paymentId,
        status: props.status,
        voidedAt: null,
        voidedBy: null,
        voidReason: null,
      },
      {
        audit: { createdBy },
        id: UniqueId.generate(),
      },
    );

    movement.addEvent(new MovementCreatedEvent(movement));

    return ok(movement);
  }

  public static fromPersistence(
    props: MovementProps,
    meta: PersistenceMeta,
  ): MovementEntity {
    return new MovementEntity(props, meta);
  }

  public clone(): MovementEntity {
    return MovementEntity.fromPersistence(
      {
        amount: this._amount,
        category: this._category,
        date: this._date,
        mode: this._mode,
        notes: this._notes,
        paymentId: this._paymentId,
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

  public isAutomatic(): boolean {
    return this._mode === MovementMode.AUTOMATIC;
  }

  public isInflow(): boolean {
    return this._amount.isPositive();
  }

  public isOutflow(): boolean {
    return this._amount.isNegative();
  }

  public isRegistered(): boolean {
    return this._status === MovementStatus.REGISTERED;
  }

  public isVoided(): boolean {
    return this._status === MovementStatus.VOIDED;
  }

  public void(props: { voidedBy: string; voidReason: string }): Result<void> {
    if (this.isVoided()) {
      return err(
        new ApplicationError('No se puede anular un movimiento anulado'),
      );
    }

    if (this.isAutomatic()) {
      return err(
        new ApplicationError('No se puede anular un movimiento automático'),
      );
    }

    const oldMovement = this.clone();

    this._status = MovementStatus.VOIDED;
    this._voidReason = props.voidReason;
    this._voidedAt = new Date();
    this._voidedBy = props.voidedBy;

    this.markAsUpdated(props.voidedBy);
    this.addEvent(new MovementUpdatedEvent(oldMovement, this));

    return ok();
  }
}
