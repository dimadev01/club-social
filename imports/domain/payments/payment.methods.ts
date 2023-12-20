import { injectable } from 'tsyringe';
import { GetDueRequestDto } from '@domain/dues/use-cases/get-due/get-due-request.dto';
import { GetDueUseCase } from '@domain/dues/use-cases/get-due/get-due.use-case';
import { GetDuesGridRequestDto } from '@domain/dues/use-cases/get-dues-grid/get-dues-grid.request.dto';
import { GetPaidDuesRequestDto } from '@domain/dues/use-cases/get-paid-dues/get-paid-dues.request.dto';
import { GetPaidDuesUseCase } from '@domain/dues/use-cases/get-paid-dues/get-paid-dues.use-case';
import { UpdateDueRequestDto } from '@domain/dues/use-cases/update-due/update-due-request.dto';
import { UpdateDueUseCase } from '@domain/dues/use-cases/update-due/update-due.use-case';
import { DeleteMovementRequestDto } from '@domain/movements/use-cases/delete-movement/delete-movement-request.dto';
import { DeleteMovementUseCase } from '@domain/movements/use-cases/delete-movement/delete-movement.use-case';
import { RestoreMovementRequestDto } from '@domain/movements/use-cases/restore-movement/restore-movement-request.dto';
import { RestoreMovementUseCase } from '@domain/movements/use-cases/restore-movement/restore-movement.use-case';
import { CreatePaymentRequestDto } from '@domain/payments/use-cases/create-payment/create-payment-request.dto';
import { CreatePaymentUseCase } from '@domain/payments/use-cases/create-payment/create-payment.use-case';
import { GetPaymentsGridUseCase } from '@domain/payments/use-cases/get-payments-grid/get-payments-grid.use-case';
import { MeteorMethod } from '@infra/meteor/common/meteor-methods.base';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';

@injectable()
export class PaymentMethod extends MeteorMethod {
  public constructor(
    private readonly _getPaymentsGrid: GetPaymentsGridUseCase,
    private readonly _getPaidDues: GetPaidDuesUseCase,
    private readonly _getDue: GetDueUseCase,
    private readonly _createPayment: CreatePaymentUseCase,
    private readonly _updateDue: UpdateDueUseCase,
    private readonly _deleteMovement: DeleteMovementUseCase,
    private readonly _restoreMovement: RestoreMovementUseCase
  ) {
    super();
  }

  public register() {
    Meteor.methods({
      [MethodsEnum.PaymentsGetGrid]: (request: GetDuesGridRequestDto) =>
        this.execute(this._getPaymentsGrid, request, GetDuesGridRequestDto),

      [MethodsEnum.PaymentsGetPaid]: (request: GetPaidDuesRequestDto) =>
        this.execute(this._getPaidDues, request, GetPaidDuesRequestDto),

      [MethodsEnum.PaymentsGet]: (request: GetDueRequestDto) =>
        this.execute(this._getDue, request, GetDueRequestDto),

      [MethodsEnum.PaymentsCreate]: (request: CreatePaymentRequestDto) =>
        this.execute(this._createPayment, request, CreatePaymentRequestDto),

      [MethodsEnum.PaymentsUpdate]: (request: UpdateDueRequestDto) =>
        this.execute(this._updateDue, request, UpdateDueRequestDto),

      [MethodsEnum.PaymentsDelete]: (request: DeleteMovementRequestDto) =>
        this.execute(this._deleteMovement, request, DeleteMovementRequestDto),

      [MethodsEnum.PaymentsRestore]: (request: RestoreMovementRequestDto) =>
        this.execute(this._restoreMovement, request, RestoreMovementRequestDto),
    });
  }
}
