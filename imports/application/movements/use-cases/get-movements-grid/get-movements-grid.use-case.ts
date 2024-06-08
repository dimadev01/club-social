import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { MovementGridDto } from '@application/movements/dtos/movement-grid.dto';
import {
  FindPaginatedRequest,
  FindPaginatedResponse,
} from '@domain/common/repositories/grid.repository';
import { IUseCase } from '@domain/common/use-case.interface';
import { IMovementRepository } from '@domain/movements/movement.repository';

@injectable()
export class GetMovementsGridUseCase
  implements
    IUseCase<FindPaginatedRequest, FindPaginatedResponse<MovementGridDto>>
{
  public constructor(
    @inject(DIToken.IMovementRepository)
    private readonly _movementRepository: IMovementRepository,
  ) {}

  public async execute(
    request: FindPaginatedRequest,
  ): Promise<Result<FindPaginatedResponse<MovementGridDto>, Error>> {
    const { items, totalCount } =
      await this._movementRepository.findPaginated(request);

    return ok({
      items: items.map<MovementGridDto>((movement) => ({
        amount: movement.amount.value,
        category: movement.category,
        date: movement.date.toISOString(),
        employeeId: movement.employeeId,
        id: movement._id,
        notes: movement.notes,
        paymentId: movement.paymentId,
        professorId: movement.professorId,
        serviceId: movement.serviceId,
        type: movement.type,
      })),
      totalCount,
    });
  }
}
