import { Result, err, ok } from 'neverthrow';

import { Model } from '@domain/common/models/model';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';
import { CreateDue, IDue } from '@domain/dues/models/due.interface';
import { Member } from '@domain/members/models/member.model';

export class Due extends Model implements IDue {
  private _amount: Money;

  private _category: DueCategoryEnum;

  private _date: DateUtcVo;

  private _member?: Member;

  private _memberId: string;

  private _notes: string | null;

  private _status: DueStatusEnum;

  public constructor(props?: IDue, member?: Member) {
    super(props);

    this._amount = props?.amount ?? new Money({ amount: 0 });

    this._category = props?.category ?? DueCategoryEnum.MEMBERSHIP;

    this._date = props?.date ?? new DateUtcVo();

    this._memberId = props?.memberId ?? '';

    this._notes = props?.notes ?? null;

    this._status = props?.status ?? DueStatusEnum.PENDING;

    this._member = member;
  }

  public get amount(): Money {
    return this._amount;
  }

  public get category(): DueCategoryEnum {
    return this._category;
  }

  public get date(): DateUtcVo {
    return this._date;
  }

  public get member(): Member | undefined {
    return this._member;
  }

  public get memberId(): string {
    return this._memberId;
  }

  public get notes(): string | null {
    return this._notes;
  }

  public get status(): DueStatusEnum {
    return this._status;
  }

  public static createOne(props: CreateDue): Result<Due, Error> {
    const due = new Due();

    const result = Result.combine([
      due.setAmount(props.amount),
      due.setCategory(props.category),
      due.setDate(props.date),
      due.setMemberId(props.memberId),
      due.setNotes(props.notes),
      due.setStatus(DueStatusEnum.PENDING),
    ]);

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(due);
  }

  public getPendingAmount(): Money {
    if (this.isPaid()) {
      return new Money({ amount: 0 });
    }

    return this._amount;
  }

  public isDeletable() {
    return this.isPending();
  }

  public isPaid(): boolean {
    return this._status === DueStatusEnum.PAID;
  }

  public isPartiallyPaid(): boolean {
    return this._status === DueStatusEnum.PARTIALLY_PAID;
  }

  public isPending(): boolean {
    return this._status === DueStatusEnum.PENDING;
  }

  public pay(amount: Money): Result<null, Error> {
    this._status = DueStatusEnum.PAID;

    if (amount.isGreaterThanOrEqual(this.amount)) {
      this._status = DueStatusEnum.PAID;
    } else {
      this._status = DueStatusEnum.PARTIALLY_PAID;
    }

    return ok(null);
  }

  public setAmount(value: Money): Result<null, Error> {
    this._amount = value;

    return ok(null);
  }

  public setCategory(value: DueCategoryEnum): Result<null, Error> {
    this._category = value;

    return ok(null);
  }

  public setDate(value: DateUtcVo): Result<null, Error> {
    this._date = value;

    return ok(null);
  }

  public setMemberId(value: string): Result<null, Error> {
    this._memberId = value;

    return ok(null);
  }

  public setNotes(value: string | null): Result<null, Error> {
    this._notes = value;

    return ok(null);
  }

  public setStatus(value: DueStatusEnum): Result<null, Error> {
    this._status = value;

    return ok(null);
  }
}
