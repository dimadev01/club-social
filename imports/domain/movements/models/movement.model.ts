import { Result, err, ok } from 'neverthrow';

import {
  MovementCategoryEnum,
  MovementStatusEnum,
  MovementTypeEnum,
} from '@domain/categories/category.enum';
import { DomainError } from '@domain/common/errors/base.error';
import { Model } from '@domain/common/models/model';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import {
  CreateMovement,
  CreatePayment,
  IMovement,
} from '@domain/movements/movement.interface';
import { Payment } from '@domain/payments/models/payment.model';

export class Movement extends Model implements IMovement {
  private _amount: Money;

  private _category: MovementCategoryEnum;

  private _date: DateUtcVo;

  private _employeeId: string | null;

  private _notes: string | null;

  private _paymentId: string | null;

  private _professorId: string | null;

  private _serviceId: string | null;

  private _status: MovementStatusEnum;

  private _type: MovementTypeEnum;

  private _voidReason: string | null;

  private _voidedAt: DateUtcVo | null;

  private _voidedBy: string | null;

  public payment?: Payment;

  public constructor(props?: IMovement, payment?: Payment) {
    super(props);

    this._amount = props?.amount ?? new Money();

    this._category = props?.category ?? MovementCategoryEnum.OTHER_INCOME;

    this._date = props?.date ?? new DateUtcVo();

    this._employeeId = props?.employeeId ?? null;

    this._paymentId = props?.paymentId ?? null;

    this._professorId = props?.professorId ?? null;

    this._serviceId = props?.serviceId ?? null;

    this._type = props?.type ?? MovementTypeEnum.INCOME;

    this._notes = props?.notes ?? null;

    this._voidReason = props?.voidReason ?? null;

    this._voidedAt = props?.voidedAt ?? null;

    this._voidedBy = props?.voidedBy ?? null;

    this._status = props?.status ?? MovementStatusEnum.REGISTERED;

    this.payment = payment;
  }

  public get amount(): Money {
    return this._amount;
  }

  public get category(): MovementCategoryEnum {
    return this._category;
  }

  public get date(): DateUtcVo {
    return this._date;
  }

  public get employeeId(): string | null {
    return this._employeeId;
  }

  public get notes(): string | null {
    return this._notes;
  }

  public get paymentId(): string | null {
    return this._paymentId;
  }

  public get professorId(): string | null {
    return this._professorId;
  }

  public get serviceId(): string | null {
    return this._serviceId;
  }

  public get status(): MovementStatusEnum {
    return this._status;
  }

  public get type(): MovementTypeEnum {
    return this._type;
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

  public static createOne(props: CreateMovement): Result<Movement, Error> {
    const movement = new Movement();

    if (
      props.category === MovementCategoryEnum.MEMBER_PAYMENT &&
      !props.paymentId
    ) {
      return err(
        new DomainError(
          'Cannot create a movement with category MEMBER_PAYMENT',
        ),
      );
    }

    const result = Result.combine([
      movement.setAmount(props.amount),
      movement.setCategory(props.category),
      movement.setDate(props.date),
      movement.setEmployeeId(props.employeeId),
      movement.setPaymentId(props.paymentId),
      movement.setProfessorId(props.professorId),
      movement.setServiceId(props.serviceId),
      movement.setType(props.type),
      movement.setNotes(props.notes),
      movement.setStatus(MovementStatusEnum.REGISTERED),
    ]);

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(movement);
  }

  public static createPayment(props: CreatePayment): Result<Movement, Error> {
    return this.createOne({
      amount: props.amount,
      category: MovementCategoryEnum.MEMBER_PAYMENT,
      date: props.date,
      employeeId: null,
      notes: props.notes,
      paymentId: props.paymentId,
      professorId: null,
      serviceId: null,
      type: MovementTypeEnum.INCOME,
    });
  }

  public isExpense(): boolean {
    return this._type === MovementTypeEnum.EXPENSE;
  }

  public isIncome(): boolean {
    return this._type === MovementTypeEnum.INCOME;
  }

  public isRegistered() {
    return this._status === MovementStatusEnum.REGISTERED;
  }

  public isUpdatable() {
    if (this._category === MovementCategoryEnum.MEMBER_PAYMENT) {
      return false;
    }

    return this.isRegistered();
  }

  public isVoidable() {
    if (this._category === MovementCategoryEnum.MEMBER_PAYMENT) {
      return false;
    }

    return this.isRegistered();
  }

  public isVoided() {
    return this._status === MovementStatusEnum.VOIDED;
  }

  public setAmount(value: Money): Result<null, Error> {
    this._amount = value;

    return ok(null);
  }

  public setCategory(value: MovementCategoryEnum): Result<null, Error> {
    this._category = value;

    return ok(null);
  }

  public setDate(value: DateUtcVo): Result<null, Error> {
    this._date = value;

    return ok(null);
  }

  public setEmployeeId(value: string | null): Result<null, Error> {
    this._employeeId = value;

    return ok(null);
  }

  public setNotes(value: string | null): Result<null, Error> {
    this._notes = value;

    return ok(null);
  }

  public setPaymentId(value: string | null): Result<null, Error> {
    this._paymentId = value;

    return ok(null);
  }

  public setProfessorId(value: string | null): Result<null, Error> {
    this._professorId = value;

    return ok(null);
  }

  public setServiceId(value: string | null): Result<null, Error> {
    this._serviceId = value;

    return ok(null);
  }

  public setType(value: MovementTypeEnum): Result<null, Error> {
    this._type = value;

    return ok(null);
  }

  public void(voidedBy: string, voidReason: string): Result<null, Error> {
    this._voidedAt = new DateUtcVo();

    this._voidedBy = voidedBy;

    this._voidReason = voidReason;

    return this.setStatus(MovementStatusEnum.VOIDED);
  }

  private setStatus(value: MovementStatusEnum): Result<null, Error> {
    this._status = value;

    return ok(null);
  }
}
