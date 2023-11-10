import { injectable } from 'tsyringe';
import { CreateMovementRequestDto } from '@domain/movements/use-cases/create-movement/create-movement-request.dto';
import { CreateMovementUseCase } from '@domain/movements/use-cases/create-movement/create-movement.use-case';
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
export class MovementMethod extends MeteorMethod {
  public constructor(
    private readonly _getMovementsGrid: GetMovementsGridUseCase,
    private readonly _getMovement: GetMovementUseCase,
    private readonly _createMovement: CreateMovementUseCase,
    private readonly _updateMovement: UpdateMovementUseCase,
    private readonly _deleteMovement: DeleteMovementUseCase,
    private readonly _restoreMovement: RestoreMovementUseCase
  ) {
    super();
  }

  public register() {
    Meteor.methods({
      [MethodsEnum.MovementsGetGrid]: (request: GetMovementsGridRequestDto) =>
        this.execute(
          this._getMovementsGrid,
          request,
          GetMovementsGridRequestDto
        ),

      [MethodsEnum.MovementsGet]: (request: GetMovementRequestDto) =>
        this.execute(this._getMovement, request),

      [MethodsEnum.MovementsCreate]: (request: CreateMovementRequestDto) =>
        this.execute(this._createMovement, request),

      [MethodsEnum.MovementsUpdate]: (request: UpdateMovementRequestDto) =>
        this.execute(this._updateMovement, request),

      [MethodsEnum.MovementsDelete]: (request: DeleteMovementRequestDto) =>
        this.execute(this._deleteMovement, request),

      [MethodsEnum.MovementsRestore]: (request: RestoreMovementRequestDto) =>
        this.execute(this._restoreMovement, request),
    });
  }
}
