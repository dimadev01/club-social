import { DueCategory } from '@club-social/shared/dues';
import { MemberCategory } from '@club-social/shared/members';

import type { BaseEntityProps } from '@/shared/domain/entity';

import { Entity } from '@/shared/domain/entity';
import { ApplicationError } from '@/shared/domain/errors/application.error';
import { err, ok, Result } from '@/shared/domain/result';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';

import { PricingCreatedEvent } from '../events/pricing-created.event';
import { PricingUpdatedEvent } from '../events/pricing-updated.event';

interface PricingProps {
  amount: Amount;
  createdBy: string;
  dueCategory: DueCategory;
  effectiveFrom: DateOnly;
  effectiveTo: DateOnly | null;
  memberCategory: MemberCategory;
}

export class PricingEntity extends Entity<PricingEntity> {
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

  public get memberCategory(): MemberCategory {
    return this._memberCategory;
  }

  private _amount: Amount;
  private _dueCategory: DueCategory;
  private _effectiveFrom: DateOnly;
  private _effectiveTo: DateOnly | null;
  private _memberCategory: MemberCategory;

  private constructor(props: PricingProps, base?: BaseEntityProps) {
    super(base);

    this._amount = props.amount;
    this._createdBy = props.createdBy;
    this._dueCategory = props.dueCategory;
    this._effectiveFrom = props.effectiveFrom;
    this._effectiveTo = props.effectiveTo;
    this._memberCategory = props.memberCategory;
    this._updatedBy = props.createdBy;
  }

  public static create(
    props: Omit<PricingProps, 'effectiveTo'>,
  ): Result<PricingEntity> {
    if (props.effectiveFrom.isBefore(DateOnly.today())) {
      return err(new ApplicationError('effectiveFrom must be in the future'));
    }

    const pricing = new PricingEntity({
      amount: props.amount,
      createdBy: props.createdBy,
      dueCategory: props.dueCategory,
      effectiveFrom: props.effectiveFrom,
      effectiveTo: null,
      memberCategory: props.memberCategory,
    });

    pricing.addEvent(new PricingCreatedEvent(pricing));

    return ok(pricing);
  }

  public static fromPersistence(
    props: PricingProps,
    base: BaseEntityProps,
  ): PricingEntity {
    return new PricingEntity(props, base);
  }

  public clone(): PricingEntity {
    return PricingEntity.fromPersistence(
      {
        amount: this._amount,
        createdBy: this._createdBy,
        dueCategory: this._dueCategory,
        effectiveFrom: this._effectiveFrom,
        effectiveTo: this._effectiveTo,
        memberCategory: this._memberCategory,
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
    effectiveTo: DateOnly | null;
    updatedBy: string;
  }): Result<void> {
    if (
      props.effectiveTo !== null &&
      this._effectiveFrom.isAfter(props.effectiveTo)
    ) {
      return err(
        new ApplicationError(
          'effectiveFrom must be before or equal to effectiveTo',
        ),
      );
    }

    const oldPricing = this.clone();
    this._amount = props.amount;
    this._effectiveTo = props.effectiveTo;
    this.markAsUpdated(props.updatedBy);
    this.addEvent(new PricingUpdatedEvent(oldPricing, this));

    return ok();
  }
}
