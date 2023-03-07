import { ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { MovementsCollection } from '@domain/movements/movements.collection';
import { GetMovementRequestDto } from '@domain/movements/use-cases/get-movement/get-movement-request.dto';
import { GetMovementResponseDto } from '@domain/movements/use-cases/get-movement/get-movement-response.dto';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

@injectable()
export class GetMovementUseCase
  extends UseCase<GetMovementRequestDto>
  implements
    IUseCase<GetMovementRequestDto, GetMovementResponseDto | undefined>
{
  public async execute(
    request: GetMovementRequestDto
  ): Promise<Result<GetMovementResponseDto | undefined, Error>> {
    await this.validateDto(GetMovementRequestDto, request);

    const movement = await MovementsCollection.findOneAsync(request.id);

    if (!movement) {
      return ok(undefined);
    }

    return ok<GetMovementResponseDto>({
      _id: movement._id,
      amount: movement.amount,
      amountFormatted: movement.amountFormatted,
      category: movement.category,
      date: movement.dateFormatted,
      notes: movement.notes,
      type: movement.type,
    });
  }
}
