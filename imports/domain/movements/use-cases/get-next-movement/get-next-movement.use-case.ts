import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { IUseCase } from '@application/use-cases/use-case.interface';
import { IMovementPort } from '@domain/movements/movement.port';
import { GetMovementRequestDto } from '@domain/movements/use-cases/get-movement/get-movement-request.dto';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class GetNextMovementUseCase
  extends UseCase<GetMovementRequestDto>
  implements IUseCase<GetMovementRequestDto, string | null>
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
