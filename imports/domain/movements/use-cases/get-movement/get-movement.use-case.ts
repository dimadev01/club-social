import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { IUseCase } from '@application/use-cases/use-case.interface';
import { IMovementPort } from '@domain/movements/movement.port';
import { GetMovementRequestDto } from '@domain/movements/use-cases/get-movement/get-movement-request.dto';
import { GetMovementResponseDto } from '@domain/movements/use-cases/get-movement/get-movement-response.dto';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class GetMovementUseCase
  extends UseCase<GetMovementRequestDto>
  implements IUseCase<GetMovementRequestDto, GetMovementResponseDto | null>
{
  public constructor(
    @inject(DIToken.MovementRepository)
    private readonly _movementPort: IMovementPort,
  ) {
    super();
  }

  public async execute(
    request: GetMovementRequestDto,
  ): Promise<Result<GetMovementResponseDto | null, Error>> {
    const movement = await this._movementPort.findOneById(request.id);

    if (!movement) {
      return ok(null);
    }

    return ok<GetMovementResponseDto>({
      _id: movement._id,
      amount: movement.amount,
      amountFormatted: movement.amountFormatted,
      category: movement.category,
      date: movement.dateFormatted,
      employeeId: movement.employeeId,
      memberId: movement.memberId,
      notes: movement.notes,
      professorId: movement.professorId,
      serviceId: movement.serviceId,
      type: movement.type,
    });
  }
}
