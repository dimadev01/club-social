import { Result, err, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { ILogger } from '@application/logger/logger.interface';
import { IUseCaseOld } from '@application/use-cases/use-case.interface';
import { IMovementPort } from '@domain/movements/movement.port';
import { MigrateMovementRequestDto } from '@domain/movements/use-cases/migrate-movement/migrate-movement-request.dto';
import { CreatePaymentUseCase } from '@domain/payments/use-cases/create-payment/create-payment.use-case';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';

@injectable()
export class MigrateMovementUseCase
  extends UseCase<MigrateMovementRequestDto>
  implements IUseCaseOld<MigrateMovementRequestDto, null>
{
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
    @inject(DIToken.MovementRepository)
    private readonly _movementPort: IMovementPort,
    @inject(CreatePaymentUseCase)
    private readonly _createPaymentUseCase: CreatePaymentUseCase,
  ) {
    super();
  }

  public async execute(
    request: MigrateMovementRequestDto,
  ): Promise<Result<null, Error>> {
    await this.validatePermission(ScopeEnum.Movements, PermissionEnum.Create);

    const movement = await this._movementPort.findOneByIdOrThrow(request.id);

    invariant(movement.memberId);

    const result = await this._createPaymentUseCase.execute({
      date: DateUtils.utc(movement.date).format(DateFormatEnum.Date),
      memberDues: [
        {
          dues: request.dues.map((requestDue) => ({
            amount: requestDue.amount,
            dueId: requestDue.dueId,
          })),
          memberId: movement.memberId,
          notes: movement.notes,
        },
      ],
    });

    if (result.isErr()) {
      return err(result.error);
    }

    movement.isMigrated = true;

    movement.paymentId = result.value.id;

    await this._movementPort.update(movement);

    await this._movementPort.delete(movement);

    this._logger.info('Movement migrated', { movement: movement._id });

    return ok(null);
  }
}
