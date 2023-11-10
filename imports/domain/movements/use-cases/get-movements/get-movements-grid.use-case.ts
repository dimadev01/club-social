import { plainToInstance } from 'class-transformer';
import { ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { IUseCase } from '@application/use-cases/use-case.interface';
import {
  CategoryEnum,
  MemberCategories,
} from '@domain/categories/category.enum';
import { Movement } from '@domain/movements/entities/movement.entity';
import { IMovementPaginatedPort } from '@domain/movements/movement.port';
import { MovementGridDto } from '@domain/movements/use-cases/get-movements/get-movements-grid.dto';
import { GetMovementsGridRequestDto } from '@domain/movements/use-cases/get-movements/get-movements-grid.request.dto';
import { GetMovementsGridResponseDto } from '@domain/movements/use-cases/get-movements/get-movements-grid.response.dto';
import { DIToken } from '@infra/di/di-tokens';
import { FindPaginatedMovement } from '@infra/mongo/repositories/movements/movement-repository.types';
import { UseCase } from '@infra/use-cases/use-case';
import { MoneyUtils } from '@shared/utils/currency.utils';

@injectable()
export class GetMovementsGridUseCase
  extends UseCase<GetMovementsGridRequestDto>
  implements IUseCase<GetMovementsGridRequestDto, GetMovementsGridResponseDto>
{
  public constructor(
    @inject(DIToken.MovementFindPaginatedRepository)
    private readonly _movementFindPaginatedPort: IMovementPaginatedPort
  ) {
    super();
  }

  public async execute(
    request: GetMovementsGridRequestDto
  ): Promise<Result<GetMovementsGridResponseDto, Error>> {
    const { data, count, debt, expenses, income, balance } =
      await this._movementFindPaginatedPort.findPaginated(request);

    return ok<GetMovementsGridResponseDto>({
      balance,
      count,
      data: data.map(
        (paginatedMovement: FindPaginatedMovement): MovementGridDto => {
          let details = '';

          const movement = plainToInstance(Movement, paginatedMovement);

          if (MemberCategories.includes(movement.category)) {
            details = movement.member?.name ?? '';
          } else if (movement.category === CategoryEnum.Employee) {
            details = movement.employee?.name ?? '';
          } else if (movement.category === CategoryEnum.Professor) {
            details = movement.professor?.name ?? '';
          } else if (movement.category === CategoryEnum.Service) {
            details = movement.service?.name ?? '';
          } else {
            details = movement.notes ?? '';
          }

          return {
            _id: movement._id,
            amount: movement.amountFormatted,
            balance: MoneyUtils.formatCents(paginatedMovement.balance),
            category: movement.category,
            date: movement.dateFormatted,
            details,
            isDeleted: movement.isDeleted,
            memberId: movement.memberId,
            type: movement.type,
          };
        }
      ),
      debt,
      expense: expenses,
      income,
    });
  }
}
