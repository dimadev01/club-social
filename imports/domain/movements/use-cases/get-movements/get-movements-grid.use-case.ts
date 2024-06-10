import { FindPaginatedMovement } from '@adapters/repositories/movements/movement-repository.types';
import { plainToInstance } from 'class-transformer';
import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { IUseCaseOld } from '@application/use-cases-old/use-case.interface';
import {
  MemberCategories,
  MovementCategoryEnum,
} from '@domain/categories/category.enum';
import { OldMovement } from '@domain/movements/entities/movement.entity';
import { IMovementPaginatedPort } from '@domain/movements/movement.port';
import { OldMovementGridDto } from '@domain/movements/use-cases/get-movements/get-movements-grid.dto';
import { OldGetMovementsGridRequestDto } from '@domain/movements/use-cases/get-movements/get-movements-grid.request.dto';
import { OldGetMovementsGridResponseDto } from '@domain/movements/use-cases/get-movements/get-movements-grid.response.dto';
import { UseCaseOld } from '@infra/use-cases/use-case';

@injectable()
export class OldGetMovementsGridUseCase
  extends UseCaseOld<OldGetMovementsGridRequestDto>
  implements
    IUseCaseOld<OldGetMovementsGridRequestDto, OldGetMovementsGridResponseDto>
{
  public constructor(
    @inject(DIToken.MovementFindPaginatedRepository)
    private readonly _movementFindPaginatedPort: IMovementPaginatedPort,
  ) {
    super();
  }

  public async execute(
    request: OldGetMovementsGridRequestDto,
  ): Promise<Result<OldGetMovementsGridResponseDto, Error>> {
    const { data, count, debt, expenses, income, balance } =
      await this._movementFindPaginatedPort.findPaginated(request);

    return ok<OldGetMovementsGridResponseDto>({
      balance,
      count,
      data: data.map(
        (paginatedMovement: FindPaginatedMovement): OldMovementGridDto => {
          let details = '';

          const movement = plainToInstance(OldMovement, paginatedMovement);

          if (MemberCategories.includes(movement.category)) {
            details = movement.member?.name ?? '';
          } else if (movement.category === MovementCategoryEnum.EMPLOYEE) {
            details = movement.employee?.name ?? '';
          } else if (movement.category === MovementCategoryEnum.PROFESSOR) {
            details = movement.professor?.name ?? '';
          } else if (movement.category === MovementCategoryEnum.SERVICE) {
            details = movement.service?.name ?? '';
          } else {
            details = movement.notes ?? '';
          }

          return {
            _id: movement._id,
            amount: movement.amountFormatted,
            category: movement.category,
            date: movement.dateFormatted,
            details,
            isDeleted: movement.isDeleted,
            memberId: movement.memberId,
            type: movement.type,
          };
        },
      ),
      debt,
      expense: expenses,
      income,
    });
  }
}
