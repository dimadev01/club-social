import { ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { MovementCollection } from '@domain/movements/movement.collection';
import { GetMovementRequestDto } from '@domain/movements/use-cases/get-movement/get-movement-request.dto';
import { GetMovementResponseDto } from '@domain/movements/use-cases/get-movement/get-movement-response.dto';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class GetMovementUseCase
  extends UseCase<GetMovementRequestDto>
  implements IUseCase<GetMovementRequestDto, GetMovementResponseDto | null>
{
  public async execute(
    request: GetMovementRequestDto
  ): Promise<Result<GetMovementResponseDto | null, Error>> {
    await this.validateDto(GetMovementRequestDto, request);

    const movement = await MovementCollection.findOneAsync(request.id);

    if (!movement) {
      return ok(null);
    }

    return ok<GetMovementResponseDto>({
      _id: movement._id,
      amount: movement.amount,
      amountFormatted: movement.amountFormatted,
      category: movement.category,
      date: movement.dateFormatted,
      employeeId: movement.employeeId,
      memberId: movement.memberId,
      notes: movement.notes,
      professorId: movement.professorId,
      serviceId: movement.serviceId,
      type: movement.type,
    });
  }
}
