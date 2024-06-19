import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { FindPaginatedResponse } from '@application/common/repositories/grid.repository';
import { IUseCase } from '@application/common/use-case.interface';
import { MovementGridDto } from '@application/movements/dtos/movement-grid.dto';
import {
  FindPaginatedMovementsRequest,
  IMovementRepository,
} from '@application/movements/repositories/movement.repository';

@injectable()
export class GetMovementsGridUseCase
  implements
    IUseCase<
      FindPaginatedMovementsRequest,
      FindPaginatedResponse<MovementGridDto>
    >
{
  public constructor(
    @inject(DIToken.IMovementRepository)
    private readonly _movementRepository: IMovementRepository,
  ) {}

  public async execute(
    request: FindPaginatedMovementsRequest,
  ): Promise<Result<FindPaginatedResponse<MovementGridDto>, Error>> {
    const { items, totalCount } =
      await this._movementRepository.findPaginated(request);

    return ok({
      items: items.map<MovementGridDto>((movement) => ({
        amount: movement.amount.amount,
        category: movement.category,
        createdAt: movement.createdAt.toISOString(),
        date: movement.date.toISOString(),
        id: movement._id,
        isExpense: movement.isExpense(),
        isIncome: movement.isIncome(),
        isRegistered: movement.isRegistered(),
        isVoided: movement.isVoided(),
        notes: movement.notes,
        paymentId: movement.paymentId,
        paymentMemberId: movement.payment?.memberId ?? null,
        paymentMemberName: movement.payment?.member?.nameLastFirst ?? null,
        status: movement.status,
        type: movement.type,
      })),
      totalCount,
    });
  }
}
