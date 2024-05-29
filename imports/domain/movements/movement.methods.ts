import { injectable } from 'tsyringe';

import { CreateMovementRequestDto } from '@domain/movements/use-cases/create-movement/create-movement-request.dto';
import { CreateMovementUseCase } from '@domain/movements/use-cases/create-movement/create-movement.use-case';
import { DeleteMovementRequestDto } from '@domain/movements/use-cases/delete-movement/delete-movement-request.dto';
import { DeleteMovementUseCase } from '@domain/movements/use-cases/delete-movement/delete-movement.use-case';
import { GetMovementRequestDto } from '@domain/movements/use-cases/get-movement/get-movement-request.dto';
import { GetMovementUseCase } from '@domain/movements/use-cases/get-movement/get-movement.use-case';
import { GetMovementsGridRequestDto } from '@domain/movements/use-cases/get-movements/get-movements-grid.request.dto';
import { GetMovementsGridUseCase } from '@domain/movements/use-cases/get-movements/get-movements-grid.use-case';
import { GetNextMovementRequestDto } from '@domain/movements/use-cases/get-next-movement/get-next-movement-request.dto';
import { GetNextMovementUseCase } from '@domain/movements/use-cases/get-next-movement/get-next-movement.use-case';
import { MigrateMovementRequestDto } from '@domain/movements/use-cases/migrate-movement/migrate-movement-request.dto';
import { MigrateMovementUseCase } from '@domain/movements/use-cases/migrate-movement/migrate-movement.use-case';
import { RestoreMovementRequestDto } from '@domain/movements/use-cases/restore-movement/restore-movement-request.dto';
import { RestoreMovementUseCase } from '@domain/movements/use-cases/restore-movement/restore-movement.use-case';
import { UpdateMovementRequestDto } from '@domain/movements/use-cases/update-movement/update-movement-request.dto';
import { UpdateMovementUseCase } from '@domain/movements/use-cases/update-movement/update-movement.use-case';
import { MeteorMethod } from '@infra/meteor/common/meteor-methods.base';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';

@injectable()
export class MovementMethod extends MeteorMethod {
  public constructor(
    private readonly _getMovementsGrid: GetMovementsGridUseCase,
    private readonly _getMovement: GetMovementUseCase,
    private readonly _createMovement: CreateMovementUseCase,
    private readonly _updateMovement: UpdateMovementUseCase,
    private readonly _deleteMovement: DeleteMovementUseCase,
    private readonly _restoreMovement: RestoreMovementUseCase,
    private readonly _migrateMovement: MigrateMovementUseCase,
    private readonly _getNextMovement: GetNextMovementUseCase,
  ) {
    super();
  }

  public register() {
    Meteor.methods({
      [MeteorMethodEnum.MovementsGetGrid]: (
        request: GetMovementsGridRequestDto,
      ) =>
        this.execute(
          this._getMovementsGrid,
          request,
          GetMovementsGridRequestDto,
        ),

      [MeteorMethodEnum.MovementsGet]: (request: GetMovementRequestDto) =>
        this.execute(this._getMovement, request, GetMovementRequestDto),

      [MeteorMethodEnum.MovementsCreate]: (request: CreateMovementRequestDto) =>
        this.execute(this._createMovement, request, CreateMovementRequestDto),

      [MeteorMethodEnum.MovementsUpdate]: (request: UpdateMovementRequestDto) =>
        this.execute(this._updateMovement, request, UpdateMovementRequestDto),

      [MeteorMethodEnum.MovementsDelete]: (request: DeleteMovementRequestDto) =>
        this.execute(this._deleteMovement, request, DeleteMovementRequestDto),

      [MeteorMethodEnum.MovementsRestore]: (
        request: RestoreMovementRequestDto,
      ) =>
        this.execute(this._restoreMovement, request, RestoreMovementRequestDto),

      [MeteorMethodEnum.MovementsMigrate]: (
        request: MigrateMovementRequestDto,
      ) =>
        this.execute(this._migrateMovement, request, MigrateMovementRequestDto),

      [MeteorMethodEnum.MovementsGetNextToMigrate]: (
        request: GetNextMovementRequestDto,
      ) =>
        this.execute(this._getNextMovement, request, GetNextMovementRequestDto),
    });
  }
}
