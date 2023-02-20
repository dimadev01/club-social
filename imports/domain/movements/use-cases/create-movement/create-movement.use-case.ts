import { err, ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
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

    const movement = Movement.create({
      amount: request.amount,
      category: request.category,
      date: request.date,
      member: null,
      notes: request.notes,
    });

    if (movement.isErr()) {
      return err(movement.error);
    }

    await MovementsCollection.insertEntity(movement.value);

    this._logger.info('Movement created', { movement });

    return ok(movement.value._id);
  }
}
