import { injectable } from 'tsyringe';
import { CreateDueRequestDto } from '@domain/dues/use-cases/create-due/create-due-request.dto';
import { CreateDueUseCase } from '@domain/dues/use-cases/create-due/create-due.use-case';
import { DeleteMovementRequestDto } from '@domain/movements/use-cases/delete-movement/delete-movement-request.dto';
import { DeleteMovementUseCase } from '@domain/movements/use-cases/delete-movement/delete-movement.use-case';
import { GetMovementRequestDto } from '@domain/movements/use-cases/get-movement/get-movement-request.dto';
import { GetMovementUseCase } from '@domain/movements/use-cases/get-movement/get-movement.use-case';
import { GetMovementsGridRequestDto } from '@domain/movements/use-cases/get-movements/get-movements-grid.request.dto';
import { GetMovementsGridUseCase } from '@domain/movements/use-cases/get-movements/get-movements-grid.use-case';
import { RestoreMovementRequestDto } from '@domain/movements/use-cases/restore-movement/restore-movement-request.dto';
import { RestoreMovementUseCase } from '@domain/movements/use-cases/restore-movement/restore-movement.use-case';
import { UpdateMovementRequestDto } from '@domain/movements/use-cases/update-movement/update-movement-request.dto';
import { UpdateMovementUseCase } from '@domain/movements/use-cases/update-movement/update-movement.use-case';
import { MeteorMethod } from '@infra/meteor/common/meteor-methods.base';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';

@injectable()
export class DueMethod extends MeteorMethod {
  public constructor(
    private readonly _getMovementsGrid: GetMovementsGridUseCase,
    private readonly _getMovement: GetMovementUseCase,
    private readonly _createDue: CreateDueUseCase,
    private readonly _updateMovement: UpdateMovementUseCase,
    private readonly _deleteMovement: DeleteMovementUseCase,
    private readonly _restoreMovement: RestoreMovementUseCase
  ) {
    super();
  }

  public register() {
    Meteor.methods({
      [MethodsEnum.DuesGetGrid]: (request: GetMovementsGridRequestDto) =>
        this.execute(
          this._getMovementsGrid,
          request,
          GetMovementsGridRequestDto
        ),

      [MethodsEnum.DuesGet]: (request: GetMovementRequestDto) =>
        this.execute(this._getMovement, request, GetMovementRequestDto),

      [MethodsEnum.DuesCreate]: (request: CreateDueRequestDto) =>
        this.execute(this._createDue, request, CreateDueRequestDto),

      [MethodsEnum.DuesUpdate]: (request: UpdateMovementRequestDto) =>
        this.execute(this._updateMovement, request, UpdateMovementRequestDto),

      [MethodsEnum.DuesDelete]: (request: DeleteMovementRequestDto) =>
        this.execute(this._deleteMovement, request, DeleteMovementRequestDto),

      [MethodsEnum.DuesRestore]: (request: RestoreMovementRequestDto) =>
        this.execute(this._restoreMovement, request, RestoreMovementRequestDto),
    });
  }
}
