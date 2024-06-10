import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { VoidMovementRequest } from '@application/movements/use-cases/void-movement/void-movement.request';
import { BaseError } from '@domain/common/errors/base.error';
import { InternalServerError } from '@domain/common/errors/internal-server.error';
import { ILogger } from '@domain/common/logger/logger.interface';
import { IUnitOfWork } from '@domain/common/repositories/unit-of-work';
import { IUseCase } from '@domain/common/use-case.interface';
import { IMovementRepository } from '@domain/movements/movement.repository';

@injectable()
export class VoidMovementUseCase
  implements IUseCase<VoidMovementRequest, null>
{
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
    @inject(DIToken.IMovementRepository)
    private readonly _movementRepository: IMovementRepository,
    @inject(DIToken.IUnitOfWork)
    private readonly _unitOfWork: IUnitOfWork,
  ) {}

  public async execute(
    request: VoidMovementRequest,
  ): Promise<Result<null, Error>> {
    this._unitOfWork.start();

    try {
      await this._unitOfWork.withTransaction(async (unitOfWork) => {
        const movement =
          await this._movementRepository.findOneByIdOrThrow(request);

        const voidResult = movement.void(request.voidedBy, request.voidReason);

        if (voidResult.isErr()) {
          throw voidResult.error;
        }

        await this._movementRepository.updateWithSession(movement, unitOfWork);
      });

      this._logger.info('Movement voided', { movement: request.id });

      return ok(null);
    } catch (error) {
      if (error instanceof BaseError) {
        return err(error);
      }

      throw new InternalServerError();
    } finally {
      await this._unitOfWork.end();
    }
  }
}
