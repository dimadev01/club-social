import { injectable } from 'tsyringe';
import { CreateDueRequestDto } from '@domain/dues/use-cases/create-due/create-due-request.dto';
import { CreateDueUseCase } from '@domain/dues/use-cases/create-due/create-due.use-case';
import { GetDueRequestDto } from '@domain/dues/use-cases/get-due/get-due-request.dto';
import { GetDueUseCase } from '@domain/dues/use-cases/get-due/get-due.use-case';
import { GetDuesGridRequestDto } from '@domain/dues/use-cases/get-dues-grid/get-dues-grid.request.dto';
import { GetDuesGridUseCase } from '@domain/dues/use-cases/get-dues-grid/get-dues-grid.use-case';
import { GetPaidDuesRequestDto } from '@domain/dues/use-cases/get-paid-dues/get-paid-dues.request.dto';
import { GetPaidDuesUseCase } from '@domain/dues/use-cases/get-paid-dues/get-paid-dues.use-case';
import { GetPendingDuesRequestDto } from '@domain/dues/use-cases/get-pending-dues/get-pending-dues.request.dto';
import { GetPendingDuesUseCase } from '@domain/dues/use-cases/get-pending-dues/get-pending-dues.use-case';
import { UpdateDueRequestDto } from '@domain/dues/use-cases/update-due/update-due-request.dto';
import { UpdateDueUseCase } from '@domain/dues/use-cases/update-due/update-due.use-case';
import { DeleteMovementRequestDto } from '@domain/movements/use-cases/delete-movement/delete-movement-request.dto';
import { DeleteMovementUseCase } from '@domain/movements/use-cases/delete-movement/delete-movement.use-case';
import { RestoreMovementRequestDto } from '@domain/movements/use-cases/restore-movement/restore-movement-request.dto';
import { RestoreMovementUseCase } from '@domain/movements/use-cases/restore-movement/restore-movement.use-case';
import { MeteorMethod } from '@infra/meteor/common/meteor-methods.base';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';

@injectable()
export class DueMethod extends MeteorMethod {
  public constructor(
    private readonly _getDuesGrid: GetDuesGridUseCase,
    private readonly _getPendingDues: GetPendingDuesUseCase,
    private readonly _getPaidDues: GetPaidDuesUseCase,
    private readonly _getDue: GetDueUseCase,
    private readonly _createDue: CreateDueUseCase,
    private readonly _updateDue: UpdateDueUseCase,
    private readonly _deleteMovement: DeleteMovementUseCase,
    private readonly _restoreMovement: RestoreMovementUseCase
  ) {
    super();
  }

  public register() {
    Meteor.methods({
      [MethodsEnum.DuesGetGrid]: (request: GetDuesGridRequestDto) =>
        this.execute(this._getDuesGrid, request, GetDuesGridRequestDto),

      [MethodsEnum.DuesGetPaid]: (request: GetPaidDuesRequestDto) =>
        this.execute(this._getPaidDues, request, GetPaidDuesRequestDto),

      [MethodsEnum.DuesGetPending]: (request: GetPendingDuesRequestDto) =>
        this.execute(this._getPendingDues, request, GetPendingDuesRequestDto),

      [MethodsEnum.DuesGet]: (request: GetDueRequestDto) =>
        this.execute(this._getDue, request, GetDueRequestDto),

      [MethodsEnum.DuesCreate]: (request: CreateDueRequestDto) =>
        this.execute(this._createDue, request, CreateDueRequestDto),

      [MethodsEnum.DuesUpdate]: (request: UpdateDueRequestDto) =>
        this.execute(this._updateDue, request, UpdateDueRequestDto),

      [MethodsEnum.DuesDelete]: (request: DeleteMovementRequestDto) =>
        this.execute(this._deleteMovement, request, DeleteMovementRequestDto),

      [MethodsEnum.DuesRestore]: (request: RestoreMovementRequestDto) =>
        this.execute(this._restoreMovement, request, RestoreMovementRequestDto),
    });
  }
}
