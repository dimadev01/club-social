import { injectable } from 'tsyringe';
import { RemoveMemberRequestDto } from '@domain/members/use-cases/remove-member/remove-member-request.dto';
import { RemoveMemberUseCase } from '@domain/members/use-cases/remove-member/remove-member.use-case';
import { CreateMovementRequestDto } from '@domain/movements/use-cases/create-movement/create-movement-request.dto';
import { CreateMovementUseCase } from '@domain/movements/use-cases/create-movement/create-movement.use-case';
import { GetMovementRequestDto } from '@domain/movements/use-cases/get-movement/get-movement-request.dto';
import { GetMovementUseCase } from '@domain/movements/use-cases/get-movement/get-movement.use-case';
import { GetMovementsByMemberGridRequestDto } from '@domain/movements/use-cases/get-movements-by-member/get-movements-by-member-grid.request.dto';
import { GetMovementsByMemberUseCase } from '@domain/movements/use-cases/get-movements-by-member/get-movements-by-member-grid.use-case';
import { GetMovementsGridRequestDto } from '@domain/movements/use-cases/get-movements/get-movements-grid.request.dto';
import { GetMovementsUseCase } from '@domain/movements/use-cases/get-movements/get-movements-grid.use-case';
import { UpdateMovementRequestDto } from '@domain/movements/use-cases/update-movement/update-movement-request.dto';
import { UpdateMovementUseCase } from '@domain/movements/use-cases/update-movement/update-movement.use-case';
import { BaseMethod } from '@infra/methods/methods.base';
import { MethodsEnum } from '@infra/methods/methods.enum';

@injectable()
export class MovementsMethods extends BaseMethod {
  public constructor(
    private readonly _getMovements: GetMovementsUseCase,
    private readonly _getMovementsByMember: GetMovementsByMemberUseCase,
    private readonly _getMovement: GetMovementUseCase,
    private readonly _createMovement: CreateMovementUseCase,
    private readonly _removeMember: RemoveMemberUseCase,
    private readonly _updateMovement: UpdateMovementUseCase
  ) {
    super();
  }

  public register() {
    Meteor.methods({
      [MethodsEnum.MovementsGetGrid]: (request: GetMovementsGridRequestDto) =>
        this.execute(this._getMovements, request),

      [MethodsEnum.MovementsByMemberGetGrid]: (
        request: GetMovementsByMemberGridRequestDto
      ) => this.execute(this._getMovementsByMember, request),

      [MethodsEnum.MovementsGet]: (request: GetMovementRequestDto) =>
        this.execute(this._getMovement, request),

      [MethodsEnum.MovementsCreate]: (request: CreateMovementRequestDto) =>
        this.execute(this._createMovement, request),

      [MethodsEnum.MovementsRemove]: (request: RemoveMemberRequestDto) =>
        this.execute(this._removeMember, request),

      [MethodsEnum.MovementsUpdate]: (request: UpdateMovementRequestDto) =>
        this.execute(this._updateMovement, request),
    });
  }
}
