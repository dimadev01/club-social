import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILoggerService } from '@application/common/logger/logger.interface';
import { IUseCase } from '@application/common/use-case.interface';
import { IMovementRepository } from '@application/movements/repositories/movement.repository';
import { VoidMovementRequest } from '@application/movements/use-cases/void-movement/void-movement.request';

@injectable()
export class VoidMovementUseCase
  implements IUseCase<VoidMovementRequest, null>
{
  public constructor(
    @inject(DIToken.ILoggerService)
    private readonly _logger: ILoggerService,
    @inject(DIToken.IMovementRepository)
    private readonly _movementRepository: IMovementRepository,
  ) {}

  public async execute(
    request: VoidMovementRequest,
  ): Promise<Result<null, Error>> {
    const movement = await this._movementRepository.findOneByIdOrThrow(request);

    const voidResult = movement.void(request.voidedBy, request.voidReason);

    if (voidResult.isErr()) {
      throw voidResult.error;
    }

    if (request.unitOfWork) {
      await this._movementRepository.updateWithSession(
        movement,
        request.unitOfWork,
      );
    } else {
      await this._movementRepository.update(movement);
    }

    this._logger.info('Movement voided', { movement: request.id });

    return ok(null);
  }
}
