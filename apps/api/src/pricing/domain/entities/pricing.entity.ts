import { DueCategory } from '@club-social/shared/dues';
import { MemberCategory } from '@club-social/shared/members';

import { ApplicationError } from '@/shared/domain/errors/application.error';
import { SoftDeletablePersistenceMeta } from '@/shared/domain/persistence-meta';
import { err, ok, Result } from '@/shared/domain/result';
import { SoftDeletableAggregateRoot } from '@/shared/domain/soft-deletable-aggregate-root';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { PricingCreatedEvent } from '../events/pricing-created.event';
import { PricingUpdatedEvent } from '../events/pricing-updated.event';

export interface PricingProps {
  amount: Amount;
  dueCategory: DueCategory;
  effectiveFrom: DateOnly;
  effectiveTo: DateOnly | null;
  memberCategory: MemberCategory | null;
}

export class PricingEntity extends SoftDeletableAggregateRoot {
  public get amount(): Amount {
    return this._amount;
  }

  public get dueCategory(): DueCategory {
    return this._dueCategory;
  }

  public get effectiveFrom(): DateOnly {
    return this._effectiveFrom;
  }

  public get effectiveTo(): DateOnly | null {
    return this._effectiveTo;
  }

  public get isBasePrice(): boolean {
    return this._memberCategory === null;
  }

  public get memberCategory(): MemberCategory | null {
    return this._memberCategory;
  }

  private _amount: Amount;
  private _dueCategory: DueCategory;
  private _effectiveFrom: DateOnly;
  private _effectiveTo: DateOnly | null;
  private _memberCategory: MemberCategory | null;

  private constructor(
    props: PricingProps,
    meta?: SoftDeletablePersistenceMeta,
  ) {
    super(meta?.id, meta?.audit, meta?.deleted);

    this._amount = props.amount;
    this._dueCategory = props.dueCategory;
    this._effectiveFrom = props.effectiveFrom;
    this._effectiveTo = props.effectiveTo;
    this._memberCategory = props.memberCategory;
  }

  public static create(
    props: Omit<PricingProps, 'effectiveTo'>,
    createdBy: string,
  ): Result<PricingEntity> {
    const pricing = new PricingEntity(
      {
        amount: props.amount,
        dueCategory: props.dueCategory,
        effectiveFrom: props.effectiveFrom,
        effectiveTo: null,
        memberCategory: props.memberCategory,
      },
      {
        audit: { createdBy },
        id: UniqueId.generate(),
      },
    );

    pricing.addEvent(new PricingCreatedEvent(pricing));

    return ok(pricing);
  }

  public static fromPersistence(
    props: PricingProps,
    meta: SoftDeletablePersistenceMeta,
  ): PricingEntity {
    return new PricingEntity(props, meta);
  }

  public clone(): PricingEntity {
    return PricingEntity.fromPersistence(
      {
        amount: this._amount,
        dueCategory: this._dueCategory,
        effectiveFrom: this._effectiveFrom,
        effectiveTo: this._effectiveTo,
        memberCategory: this._memberCategory,
      },
      {
        audit: { ...this._audit },
        deleted: { ...this._deleted },
        id: this.id,
      },
    );
  }

  public close(effectiveTo: DateOnly, updatedBy: string) {
    const oldPricing = this.clone();

    this._effectiveTo = effectiveTo;

    this.markAsUpdated(updatedBy);
    this.addEvent(new PricingUpdatedEvent(oldPricing, this));
  }

  public isActiveOn(date: DateOnly): boolean {
    const isAfterOrEqualStart = !this._effectiveFrom.isAfter(date);
    const isBeforeEnd =
      this._effectiveTo === null || date.isBefore(this._effectiveTo);

    return isAfterOrEqualStart && isBeforeEnd;
  }

  public update(props: {
    amount: Amount;
    effectiveFrom: DateOnly;
    updatedBy: string;
  }): Result<void> {
    if (this._effectiveTo !== null) {
      return err(
        new ApplicationError('No se puede actualizar un precio cerrado'),
      );
    }

    const oldPricing = this.clone();

    this._amount = props.amount;
    this._effectiveFrom = props.effectiveFrom;

    this.markAsUpdated(props.updatedBy);
    this.addEvent(new PricingUpdatedEvent(oldPricing, this));

    return ok();
  }
}
