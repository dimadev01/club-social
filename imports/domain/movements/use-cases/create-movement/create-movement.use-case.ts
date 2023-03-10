import { err, ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { MemberCategories } from '@domain/categories/categories.enum';
import { Movement } from '@domain/movements/movement.entity';
import { MovementsCollection } from '@domain/movements/movements.collection';
import { CreateMovementRequestDto } from '@domain/movements/use-cases/create-movement/create-movement-request.dto';
import { Logger } from '@infra/logger/logger.service';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

@injectable()
export class CreateMovementUseCase
  extends UseCase<CreateMovementRequestDto>
  implements IUseCase<CreateMovementRequestDto, string>
{
  public constructor(private readonly _logger: Logger) {
    super();
  }

  public async execute(
    request: CreateMovementRequestDto
  ): Promise<Result<string, Error>> {
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
