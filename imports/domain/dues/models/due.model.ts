import { Result, err, ok } from 'neverthrow';

import { Model } from '@domain/common/models/model';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';
import { CreateDue, CreateDuePayment, IDue } from '@domain/dues/due.interface';
import { DuePayment } from '@domain/dues/models/due-payment.model';
import { Member } from '@domain/members/models/member.model';

export class Due extends Model implements IDue {
  private _amount: Money;

  private _balanceAmount: Money;

  private _category: DueCategoryEnum;

  private _date: DateUtcVo;

  private _memberId: string;

  private _notes: string | null;

  private _payments: DuePayment[];

  private _status: DueStatusEnum;

  private _totalPaidAmount: Money;

  private _voidReason: string | null;

  private _voidedAt: DateUtcVo | null;

  private _voidedBy: string | null;

  public member?: Member;

  public constructor(props?: IDue, member?: Member) {
    super(props);

    this._amount = props?.amount ?? new Money({ amount: 0 });

    this._category = props?.category ?? DueCategoryEnum.MEMBERSHIP;

    this._date = props?.date ?? new DateUtcVo();

    this._memberId = props?.memberId ?? '';

    this._notes = props?.notes ?? null;

    this._status = props?.status ?? DueStatusEnum.PENDING;

    this._totalPaidAmount = new Money({ amount: 0 });

    this._balanceAmount = this._amount;

    this._voidedAt = props?.voidedAt ?? null;

    this._voidedBy = props?.voidedBy ?? null;

    this._voidReason = props?.voidReason ?? null;

    this._payments =
      props?.payments.map((payment) => new DuePayment(payment)) ?? [];

    this.member = member;
  }

  public get amount(): Money {
    return this._amount;
  }

  public get balanceAmount(): Money {
    return this._balanceAmount;
  }

  public get category(): DueCategoryEnum {
    return this._category;
  }

  public get date(): DateUtcVo {
    return this._date;
  }

  public get memberId(): string {
    return this._memberId;
  }

  public get notes(): string | null {
    return this._notes;
  }

  public get payments(): DuePayment[] {
    return this._payments;
  }

  public get status(): DueStatusEnum {
    return this._status;
  }

  public get totalPaidAmount(): Money {
    return this._totalPaidAmount;
  }

  public get voidReason(): string | null {
    return this._voidReason;
  }

  public get voidedAt(): DateUtcVo | null {
    return this._voidedAt;
  }

  public get voidedBy(): string | null {
    return this._voidedBy;
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

  public addPayment(props: CreateDuePayment): Result<DuePayment, Error> {
    const duePayment = DuePayment.createOne(props);

    if (duePayment.isErr()) {
      return err(duePayment.error);
    }

    this._payments.push(duePayment.value);

    this._totalPaidAmount = this._totalPaidAmount.add(duePayment.value.amount);

    this._balanceAmount = this._balanceAmount.subtract(this._totalPaidAmount);

    if (this._balanceAmount.isLessThan(new Money({ amount: 0 }))) {
      this._balanceAmount = new Money({ amount: 0 });
    }

    if (this._balanceAmount.isGreaterThan(new Money({ amount: 0 }))) {
      this._status = DueStatusEnum.PARTIALLY_PAID;
    } else {
      this._status = DueStatusEnum.PAID;
    }

    return ok(duePayment.value);
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

  public revertToPending(): Result<null, Error> {
    this._payments = [];

    this._totalPaidAmount = new Money({ amount: 0 });

    this._balanceAmount = this._amount;

    return this.setStatus(DueStatusEnum.PENDING);
  }

  public void(voidedBy: string, voidReason: string): Result<null, Error> {
    this._voidedAt = new DateUtcVo();

    this._voidedBy = voidedBy;

    this._voidReason = voidReason;

    return this.setStatus(DueStatusEnum.VOIDED);
  }

  private setAmount(value: Money): Result<null, Error> {
    this._amount = value;

    return ok(null);
  }

  private setCategory(value: DueCategoryEnum): Result<null, Error> {
    this._category = value;

    return ok(null);
  }

  private setDate(value: DateUtcVo): Result<null, Error> {
    this._date = value;

    return ok(null);
  }

  private setMemberId(value: string): Result<null, Error> {
    this._memberId = value;

    return ok(null);
  }

  private setNotes(value: string | null): Result<null, Error> {
    this._notes = value;

    return ok(null);
  }

  private setStatus(value: DueStatusEnum): Result<null, Error> {
    this._status = value;

    return ok(null);
  }
}
