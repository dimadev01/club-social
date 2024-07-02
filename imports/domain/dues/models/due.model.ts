import { Result, err, ok } from 'neverthrow';
import invariant from 'tiny-invariant';

import { DomainError } from '@domain/common/errors/domain.error';
import { InternalServerError } from '@domain/common/errors/internal-server.error';
import { Model } from '@domain/common/models/model';
import { DateVo } from '@domain/common/value-objects/date.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';
import { CreateDue, CreateDuePayment, IDue } from '@domain/dues/due.interface';
import { DuePayment } from '@domain/dues/models/due-payment.model';
import { Member } from '@domain/members/models/member.model';

export class Due extends Model implements IDue {
  private _amount: Money;

  private _category: DueCategoryEnum;

  private _date: DateVo;

  private _memberId: string;

  private _notes: string | null;

  private _payments: DuePayment[];

  private _status: DueStatusEnum;

  private _totalPaidAmount: Money;

  private _totalPendingAmount: Money;

  private _voidReason: string | null;

  private _voidedAt: DateVo | null;

  private _voidedBy: string | null;

  public member?: Member;

  public constructor(props?: IDue, member?: Member) {
    super(props);

    this._amount = props?.amount ?? Money.from();

    this._category = props?.category ?? DueCategoryEnum.MEMBERSHIP;

    this._date = props?.date ?? new DateVo();

    this._memberId = props?.memberId ?? '';

    this._notes = props?.notes ?? null;

    this._status = props?.status ?? DueStatusEnum.PENDING;

    this._totalPaidAmount = props?.totalPaidAmount ?? Money.from();

    this._totalPendingAmount = props?.totalPendingAmount ?? this._amount;

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

  public get category(): DueCategoryEnum {
    return this._category;
  }

  public get date(): DateVo {
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

  public get totalPendingAmount(): Money {
    return this._totalPendingAmount;
  }

  public get voidReason(): string | null {
    return this._voidReason;
  }

  public get voidedAt(): DateVo | null {
    return this._voidedAt;
  }

  public get voidedBy(): string | null {
    return this._voidedBy;
  }

  public static create(props: CreateDue): Result<Due, Error> {
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
    const duePayment = DuePayment.create(props);

    if (duePayment.isErr()) {
      return err(duePayment.error);
    }

    this._payments.push(duePayment.value);

    this._addToTotalPaidAmount(duePayment.value.totalAmount);

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

  public isPayable() {
    return this.isPending() || this.isPartiallyPaid();
  }

  public isPending(): boolean {
    return this._status === DueStatusEnum.PENDING;
  }

  public isUpdatable() {
    return this.isPending();
  }

  public isVoidable(): boolean {
    return this.isPending();
  }

  public isVoided() {
    return this._status === DueStatusEnum.VOIDED;
  }

  public setAmount(value: Money): Result<null, Error> {
    this._amount = value;

    this._totalPendingAmount = this._amount;

    return ok(null);
  }

  public setNotes(value: string | null): Result<null, Error> {
    this._notes = value;

    return ok(null);
  }

  public void(voidedBy: string, voidReason: string): Result<null, Error> {
    if (this.isVoided()) {
      return err(new DomainError('La deuda ya se encuentra anulada.'));
    }

    if (this._allPaymentsValid()) {
      return err(
        new DomainError('No se puede anular una deuda con pagos asociados'),
      );
    }

    this._voidedAt = new DateVo();

    this._voidedBy = voidedBy;

    this._voidReason = voidReason;

    return this.setStatus(DueStatusEnum.VOIDED);
  }

  public voidPayment(paymentId: string): Result<null, Error> {
    const paymentToVoid = this._payments.find(
      (duePayment) => duePayment.paymentId === paymentId,
    );

    invariant(paymentToVoid);

    const voidResult = paymentToVoid.void();

    if (voidResult.isErr()) {
      return err(voidResult.error);
    }

    this._totalPaidAmount = this._totalPaidAmount.subtract(
      paymentToVoid.totalAmount,
    );

    this.calculateTotalPendingAmount();

    this._calculateStatus();

    return ok(null);
  }

  private _addToTotalPaidAmount(amount: Money): void {
    this._totalPaidAmount = this._totalPaidAmount.add(amount);

    this.calculateTotalPendingAmount();

    this._calculateStatus();
  }

  private _allPaymentsValid(): boolean {
    if (this._payments.length === 0) {
      return true;
    }

    return this._payments.every((payment) => payment.isPaid());
  }

  private _calculateStatus(): void {
    if (this._totalPendingAmount.isEqual(this._amount)) {
      this._status = DueStatusEnum.PENDING;
    } else if (this._totalPendingAmount.isGreaterThanZero()) {
      this._status = DueStatusEnum.PARTIALLY_PAID;
    } else if (this._totalPendingAmount.isLessThanOrEqualZero()) {
      this._status = DueStatusEnum.PAID;
    } else {
      throw new InternalServerError();
    }
  }

  public calculateTotalPendingAmount(): void {
    this._totalPendingAmount = this._amount.subtract(this._totalPaidAmount);

    if (this._totalPendingAmount.isLessThanZero()) {
      this._totalPendingAmount = Money.from();
    }
  }

  private setCategory(value: DueCategoryEnum): Result<null, Error> {
    this._category = value;

    return ok(null);
  }

  private setDate(value: DateVo): Result<null, Error> {
    this._date = value;

    return ok(null);
  }

  private setMemberId(value: string): Result<null, Error> {
    this._memberId = value;

    return ok(null);
  }

  private setStatus(value: DueStatusEnum): Result<null, Error> {
    if (this.isVoided()) {
      return err(
        new DomainError('No se puede cambiar el estado de una deuda anulada.'),
      );
    }

    this._status = value;

    return ok(null);
  }
}
