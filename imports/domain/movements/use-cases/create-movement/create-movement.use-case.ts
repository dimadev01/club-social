import { err, ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { UseCase } from '@application/common/use-case.base';
import { IUseCase } from '@application/common/use-case.interfaces';
import { ILogger } from '@application/logger/logger.interface';
import { MemberCategories } from '@domain/categories/categories.enum';
import { Movement } from '@domain/movements/movement.entity';
import { IMovementPort } from '@domain/movements/movement.port';
import { CreateMovementRequestDto } from '@domain/movements/use-cases/create-movement/create-movement-request.dto';
import { Permission, Scope } from '@domain/roles/roles.enum';
import { Tokens } from '@infra/di/di-tokens';

@injectable()
export class CreateMovementUseCase
  extends UseCase<CreateMovementRequestDto>
  implements IUseCase<CreateMovementRequestDto, null>
{
  public constructor(
    @inject(Tokens.Logger)
    private readonly _logger: ILogger,
    @inject(Tokens.MovementRepository)
    private readonly _movementRepository: IMovementPort
  ) {
    super();
  }

  public async execute(
    request: CreateMovementRequestDto
  ): Promise<Result<null, Error>> {
    this.validatePermission(Scope.Movements, Permission.Create);

    if (MemberCategories.includes(request.category)) {
      const result = await this._createWithMember(request);

      if (result.isErr()) {
        return err(result.error);
      }

      return ok(null);
    }

    const movement = Movement.create({
      amount: request.amount,
      category: request.category,
      date: request.date,
      employeeId: request.employeeId,
      memberId: null,
      notes: request.notes,
      professorId: request.professorId,
      serviceId: request.serviceId,
      type: request.type,
    });

    await this._movementRepository.create(movement);

    this._logger.info('Movement created', { movement });

    return ok(null);
  }

  private async _createWithMember(
    request: CreateMovementRequestDto
  ): Promise<Result<null, Error>> {
    if (!request.memberIds || request.memberIds.length === 0) {
      return err(new Error('No members selected'));
    }

    await Promise.all(
      request.memberIds.map(async (memberId: string) => {
        const movement = Movement.create({
          amount: request.amount,
          category: request.category,
          date: request.date,
          employeeId: request.employeeId,
          memberId,
          notes: request.notes,
          professorId: request.professorId,
          serviceId: request.serviceId,
          type: request.type,
        });

        await this._movementRepository.create(movement);
      })
    );

    return ok(null);
  }
}
