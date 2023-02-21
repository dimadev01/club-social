import { injectable } from 'tsyringe';
import { RemoveMemberRequestDto } from '@domain/members/use-cases/remove-member/remove-member-request.dto';
import { RemoveMemberUseCase } from '@domain/members/use-cases/remove-member/remove-member.use-case';
import { CreateMovementRequestDto } from '@domain/movements/use-cases/create-movement/create-movement-request.dto';
import { CreateMovementUseCase } from '@domain/movements/use-cases/create-movement/create-movement.use-case';
import { GetMovementRequestDto } from '@domain/movements/use-cases/get-movement/get-movement-request.dto';
import { GetMovementUseCase } from '@domain/movements/use-cases/get-movement/get-movement.use-case';
import { GetMovementsUseCase } from '@domain/movements/use-cases/get-movements/get-movements-grid.use-case';
import { UpdateMovementRequestDto } from '@domain/movements/use-cases/update-movement/update-movement-request.dto';
import { UpdateMovementUseCase } from '@domain/movements/use-cases/update-movement/update-movement.use-case';
import { BaseMethod } from '@infra/methods/methods.base';
import { MethodsEnum } from '@infra/methods/methods.enum';
import { PaginatedRequestDto } from '@kernel/paginated-request.dto';

@injectable()
export class MovementsMethods extends BaseMethod {
  public constructor(
    private readonly _getMovementsUseCase: GetMovementsUseCase,
    private readonly _getMovementUseCase: GetMovementUseCase,
    private readonly _createMovementUseCase: CreateMovementUseCase,
    private readonly _removeMemberUseCase: RemoveMemberUseCase,
    private readonly _updateMovementUseCase: UpdateMovementUseCase
  ) {
    super();
  }

  public register() {
    Meteor.methods({
      [MethodsEnum.MovementsGetGrid]: (request: PaginatedRequestDto) =>
        this.execute(this._getMovementsUseCase, request),

      [MethodsEnum.MovementsGet]: (request: GetMovementRequestDto) =>
        this.execute(this._getMovementUseCase, request),

      [MethodsEnum.MovementsCreate]: (request: CreateMovementRequestDto) =>
        this.execute(this._createMovementUseCase, request),

      [MethodsEnum.MovementsRemove]: (request: RemoveMemberRequestDto) =>
        this.execute(this._removeMemberUseCase, request),

      [MethodsEnum.MovementsUpdate]: (request: UpdateMovementRequestDto) =>
        this.execute(this._updateMovementUseCase, request),
    });
  }
}
