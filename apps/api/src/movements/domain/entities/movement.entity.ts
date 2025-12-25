import {
  MovementCategory,
  MovementMode,
  MovementStatus,
  MovementType,
} from '@club-social/shared/movements';

import { BaseEntityProps, Entity } from '@/shared/domain/entity';
import { ApplicationError } from '@/shared/domain/errors/application.error';
import { err, ok, Result } from '@/shared/domain/result';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { MovementCreatedEvent } from '../events/movement-created.event';
import { MovementUpdatedEvent } from '../events/movement-updated.event';
import { CreateMovementProps, VoidMovementProps } from '../movement.interface';

interface MovementProps {
  amount: Amount;
  category: MovementCategory;
  createdBy: string;
  date: DateOnly;
  description: null | string;
  mode: MovementMode;
  paymentId: null | UniqueId;
  status: MovementStatus;
  type: MovementType;
  voidedAt: Date | null;
  voidedBy: null | string;
  voidReason: null | string;
}

export class MovementEntity extends Entity<MovementEntity> {
  public get amount(): Amount {
    return this._amount;
  }

  public get category(): MovementCategory {
    return this._category;
  }

  public get date(): DateOnly {
    return this._date;
  }

  public get description(): null | string {
    return this._description;
  }

  public get mode(): MovementMode {
    return this._mode;
  }

  public get paymentId(): null | UniqueId {
    return this._paymentId;
  }

  public get status(): MovementStatus {
    return this._status;
  }

  public get type(): MovementType {
    return this._type;
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
  private _category: MovementCategory;
  private _date: DateOnly;
  private _description: null | string;
  private _mode: MovementMode;
  private _paymentId: null | UniqueId;
  private _status: MovementStatus;
  private _type: MovementType;
  private _voidedAt: Date | null;
  private _voidedBy: null | string;
  private _voidReason: null | string;

  private constructor(props: MovementProps, base?: BaseEntityProps) {
    super(base);

    this._amount = props.amount;
    this._category = props.category;
    this._date = props.date;
    this._description = props.description;
    this._mode = props.mode;
    this._paymentId = props.paymentId;
    this._status = props.status;
    this._type = props.type;
    this._voidReason = props.voidReason;
    this._voidedAt = props.voidedAt;
    this._voidedBy = props.voidedBy;
    this._createdBy = props.createdBy;
    this._updatedBy = props.createdBy;
  }

  public static create(props: CreateMovementProps): Result<MovementEntity> {
    const movement = new MovementEntity({
      amount: props.amount,
      category: props.category,
      createdBy: props.createdBy,
      date: props.date,
      description: props.description,
      mode: props.mode,
      paymentId: props.paymentId,
      status: MovementStatus.REGISTERED,
      type: props.type,
      voidedAt: null,
      voidedBy: null,
      voidReason: null,
    });

    movement.addEvent(new MovementCreatedEvent(movement));

    return ok(movement);
  }

  public static fromPersistence(
    props: MovementProps,
    base: BaseEntityProps,
  ): MovementEntity {
    return new MovementEntity(props, base);
  }

  public clone(): MovementEntity {
    return MovementEntity.fromPersistence(
      {
        amount: this._amount,
        category: this._category,
        createdBy: this._createdBy,
        date: this._date,
        description: this._description,
        mode: this._mode,
        paymentId: this._paymentId,
        status: this._status,
        type: this._type,
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

  public isInflow(): boolean {
    return this._type === MovementType.INFLOW;
  }

  public isOutflow(): boolean {
    return this._type === MovementType.OUTFLOW;
  }

  public isRegistered(): boolean {
    return this._status === MovementStatus.REGISTERED;
  }

  public isVoided(): boolean {
    return this._status === MovementStatus.VOIDED;
  }

  public void(props: VoidMovementProps): Result<void> {
    if (this.isVoided()) {
      return err(
        new ApplicationError('No se puede anular un movimiento anulado'),
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
