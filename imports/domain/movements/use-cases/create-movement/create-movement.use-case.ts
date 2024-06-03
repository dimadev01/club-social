import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { IUseCaseOld } from '@application/use-cases-old/use-case.interface';
import { ILogger } from '@domain/common/logger/logger.interface';
import { Movement } from '@domain/movements/entities/movement.entity';
import { IMovementPort } from '@domain/movements/movement.port';
import { CreateMovementRequestDto } from '@domain/movements/use-cases/create-movement/create-movement-request.dto';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { UseCaseOld } from '@infra/use-cases/use-case';

@injectable()
export class CreateMovementUseCase
  extends UseCaseOld<CreateMovementRequestDto>
  implements IUseCaseOld<CreateMovementRequestDto, null>
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
    request: CreateMovementRequestDto,
  ): Promise<Result<null, Error>> {
    await this.validatePermission(ScopeEnum.MOVEMENTS, PermissionEnum.CREATE);

    const movement = Movement.create({
      amount: request.amount,
      category: request.category,
      date: request.date,
      employeeId: request.employeeId,
      memberId: null,
      notes: request.notes,
      professorId: request.professorId,
      serviceId: request.serviceId,
      type: request.type,
    });

    if (movement.isErr()) {
      return err(movement.error);
    }

    await this._movementPort.create(movement.value);

    this._logger.info('Movement created', { movement: movement.value });

    return ok(null);
  }
}
