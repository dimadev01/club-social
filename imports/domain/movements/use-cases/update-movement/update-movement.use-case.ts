import { err, ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { ILogger } from '@application/logger/logger.interface';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { IMovementPort } from '@domain/movements/movement.port';
import { UpdateMovementRequestDto } from '@domain/movements/use-cases/update-movement/update-movement-request.dto';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class UpdateMovementUseCase
  extends UseCase<UpdateMovementRequestDto>
  implements IUseCase<UpdateMovementRequestDto, null>
{
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
    @inject(DIToken.MovementRepository)
    private readonly _movementPort: IMovementPort,
  ) {
    super();
  }

  public async execute(
    request: UpdateMovementRequestDto,
  ): Promise<Result<null, Error>> {
    await this.validatePermission(ScopeEnum.Movements, PermissionEnum.Update);

    const movement = await this._movementPort.findOneByIdOrThrow(request.id);

    const updateMovementResult: Result<null[], Error> = Result.combine([
      movement.setDate(new Date(request.date)),
      movement.setAmount(request.amount),
      movement.setNotes(request.notes),
      movement.setMemberId(request.memberId),
      movement.setEmployeeId(request.employeeId),
      movement.setProfessorId(request.professorId),
      movement.setServiceId(request.serviceId),
    ]);

    if (updateMovementResult.isErr()) {
      return err(updateMovementResult.error);
    }

    await this._movementPort.update(movement);

    this._logger.info('Movement updated', { movementId: request.id });

    return ok(null);
  }
}
