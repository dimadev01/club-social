import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { IUseCaseOld } from '@application/use-cases-old/use-case.interface';
import { IMovementPort } from '@domain/movements/movement.port';
import { GetMovementRequestDto } from '@domain/movements/use-cases/get-movement/get-movement-request.dto';
import { UseCaseOld } from '@infra/use-cases/use-case';

@injectable()
export class GetNextMovementUseCase
  extends UseCaseOld<GetMovementRequestDto>
  implements IUseCaseOld<GetMovementRequestDto, string | null>
{
  public constructor(
    @inject(DIToken.MovementRepository)
    private readonly _movementPort: IMovementPort,
  ) {
    super();
  }

  public async execute(
    request: GetMovementRequestDto,
  ): Promise<Result<string | null, Error>> {
    const movement = await this._movementPort.findNextToMigrate(request.id);

    if (!movement) {
      return ok(null);
    }

    return ok<string>(movement._id);
  }
}
