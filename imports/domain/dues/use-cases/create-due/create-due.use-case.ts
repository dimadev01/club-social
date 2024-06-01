import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { IUseCaseOld } from '@application/use-cases-old/use-case.interface';
import { ILogger } from '@domain/common/logger/logger.interface';
import { DIToken } from '@domain/common/tokens.di';
import { IDuePortOld } from '@domain/dues/due.port';
import { Due } from '@domain/dues/entities/due.entity';
import { CreateDueRequestDto } from '@domain/dues/use-cases/create-due/create-due-request.dto';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { UseCaseOld } from '@infra/use-cases/use-case';
import { ErrorUtils } from '@shared/utils/error.utils';
import { MongoUtilsOld } from '@shared/utils/mongo.utils';

@injectable()
export class CreateDueUseCase
  extends UseCaseOld<CreateDueRequestDto>
  implements IUseCaseOld<CreateDueRequestDto, null>
{
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
    @inject(DIToken.DueRepository)
    private readonly _duePort: IDuePortOld,
  ) {
    super();
  }

  public async execute(
    request: CreateDueRequestDto,
  ): Promise<Result<null, Error>> {
    await this.validatePermission(ScopeEnum.DUES, PermissionEnum.CREATE);

    const session = MongoUtilsOld.startSession();

    try {
      await session.withTransaction(async () => {
        await Promise.all(
          request.memberIds.map(async (memberId: string) => {
            const due = Due.create({
              amount: request.amount,
              category: request.category,
              date: request.date,
              memberId,
              notes: request.notes,
            });

            if (due.isErr()) {
              throw due.error;
            }

            await this._duePort.create(due.value);
          }),
        );
      });

      return ok(null);
    } catch (error) {
      this._logger.error(error);

      return err(ErrorUtils.unknownToError(error));
    } finally {
      await session.endSession();
    }
  }
}
