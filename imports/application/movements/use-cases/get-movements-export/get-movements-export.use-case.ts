import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { IUseCase } from '@application/common/use-case.interface';
import { MovementGridDto } from '@application/movements/dtos/movement-grid.dto';
import {
  FindPaginatedMovementsRequest,
  IMovementRepository,
} from '@application/movements/repositories/movement.repository';

@injectable()
export class GetMovementsToExportUseCase
  implements IUseCase<FindPaginatedMovementsRequest, MovementGridDto[]>
{
  public constructor(
    @inject(DIToken.IMovementRepository)
    private readonly _movementRepository: IMovementRepository,
  ) {}

  public async execute(
    request: FindPaginatedMovementsRequest,
  ): Promise<Result<MovementGridDto[], Error>> {
    const movements = await this._movementRepository.findToExport(request);

    return ok<MovementGridDto[]>(
      movements.map<MovementGridDto>((movement) => ({
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
    );
  }
}
