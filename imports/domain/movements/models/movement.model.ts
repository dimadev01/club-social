import { Result, err, ok } from 'neverthrow';

import {
  MovementCategoryEnum,
  MovementTypeEnum,
} from '@domain/categories/category.enum';
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

  private _type: MovementTypeEnum;

  public payment?: Payment;

  public constructor(props?: IMovement, payment?: Payment) {
    super(props);

    this._amount = props?.amount ?? new Money();

    this._category = props?.category ?? MovementCategoryEnum.OtherIncome;

    this._date = props?.date ?? new DateUtcVo();

    this._employeeId = props?.employeeId ?? null;

    this._paymentId = props?.paymentId ?? null;

    this._professorId = props?.professorId ?? null;

    this._serviceId = props?.serviceId ?? null;

    this._type = props?.type ?? MovementTypeEnum.Income;

    this._notes = props?.notes ?? null;

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

  public get type(): MovementTypeEnum {
    return this._type;
  }

  public static createPayment(props: CreatePayment): Result<Movement, Error> {
    return this.createOne({
      amount: props.amount,
      category: MovementCategoryEnum.MemberIncome,
      date: props.date,
      employeeId: null,
      notes: props.notes,
      paymentId: props.paymentId,
      professorId: null,
      serviceId: null,
      type: MovementTypeEnum.Income,
    });
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

  private static createOne(props: CreateMovement): Result<Movement, Error> {
    const movement = new Movement();

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
    ]);

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(movement);
  }
}
