import { find } from 'lodash';
import { err, ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { MembersCollection } from '@domain/members/members.collection';
import { Movement } from '@domain/movements/movement.entity';
import { MovementsCollection } from '@domain/movements/movements.collection';
import { CreateMovementRequestDto } from '@domain/movements/use-cases/create-movement/create-movement-request.dto';
import { Logger } from '@infra/logger/logger.service';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';
import { CurrencyUtils } from '@shared/utils/currency.utils';

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

    if (request.memberIds && request.memberIds.length > 0) {
      const members = await MembersCollection.find({
        _id: { $in: request.memberIds },
      }).fetchAsync();

      const results = await Promise.all(
        request.memberIds.map(async (memberId: string) => {
          const member = find(members, { _id: memberId });

          if (!member) {
            return err(new Error('Member not found'));
          }

          const movement = Movement.create({
            amount: CurrencyUtils.toCents(request.amount),
            category: request.category,
            date: request.date,
            member: {
              _id: memberId,
              firstName: member.firstName,
              lastName: member.lastName,
            },
            notes: request.notes,
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
      amount: CurrencyUtils.toCents(request.amount),
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
