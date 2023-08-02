import { err, ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { UseCase } from '@application/common/use-case.base';
import { IUseCase } from '@application/common/use-case.interfaces';
import { ILogger } from '@application/logger/logger.interface';
import { MemberCategories } from '@domain/enums/categories.enum';
import { Movement } from '@domain/movements/movement.entity';
import { MovementsCollection } from '@domain/movements/movements.collection';
import { CreateMovementRequestDto } from '@domain/movements/use-cases/create-movement/create-movement-request.dto';
import { Permission, Scope } from '@domain/roles/roles.enum';
import { Tokens } from '@infra/di/di-tokens';

@injectable()
export class CreateMovementUseCase
  extends UseCase<CreateMovementRequestDto>
  implements IUseCase<CreateMovementRequestDto, string>
{
  public constructor(
    @inject(Tokens.Logger)
    private readonly _logger: ILogger
  ) {
    super();
  }

  public async execute(
    request: CreateMovementRequestDto
  ): Promise<Result<string, Error>> {
    this.validatePermission(Scope.Movements, Permission.Create);

    await this.validateDto(CreateMovementRequestDto, request);

    if (MemberCategories.includes(request.category)) {
      if (!request.memberIds || request.memberIds.length === 0) {
        return err(new Error('No members selected'));
      }

      const results = await Promise.all(
        request.memberIds.map(async (memberId: string) => {
          const movement = Movement.create({
            amount: request.amount,
            category: request.category,
            date: request.date,
            employeeId: request.employeeId,
            memberId,
            notes: request.notes,
            professorId: request.professorId,
            rentalId: request.rentalId,
            serviceId: request.serviceId,
            type: request.type,
          });

          if (movement.isErr()) {
            return err(movement.error);
          }

          await MovementsCollection.insertEntity(movement.value);

          this._logger.info('Movement created', { movement });

          return ok(movement.value._id);
        })
      );

      const resultsCombined = Result.combine(results);

      if (resultsCombined.isErr()) {
        return err(resultsCombined.error);
      }

      return ok(resultsCombined.value[0]);
    }

    const movement = Movement.create({
      amount: request.amount,
      category: request.category,
      date: request.date,
      employeeId: request.employeeId,
      memberId: null,
      notes: request.notes,
      professorId: request.professorId,
      rentalId: request.rentalId,
      serviceId: request.serviceId,
      type: request.type,
    });

    if (movement.isErr()) {
      return err(movement.error);
    }

    await MovementsCollection.insertEntity(movement.value);

    this._logger.info('Movement created', { movement });

    return ok(movement.value._id);
  }
}
