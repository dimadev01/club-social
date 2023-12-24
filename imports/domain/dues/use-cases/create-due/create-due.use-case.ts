import { err, ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { ILogger } from '@application/logger/logger.interface';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { IDuePort } from '@domain/dues/due.port';
import { DueMember } from '@domain/dues/entities/due-member';
import { Due } from '@domain/dues/entities/due.entity';
import { CreateDueRequestDto } from '@domain/dues/use-cases/create-due/create-due-request.dto';
import { IMemberPort } from '@domain/members/member.port';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';
import { ErrorUtils } from '@shared/utils/error.utils';
import { MongoUtils } from '@shared/utils/mongo.utils';

@injectable()
export class CreateDueUseCase
  extends UseCase<CreateDueRequestDto>
  implements IUseCase<CreateDueRequestDto, null>
{
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
    @inject(DIToken.DueRepository)
    private readonly _duePort: IDuePort,
    @inject(DIToken.MemberRepository)
    private readonly _memberPort: IMemberPort
  ) {
    super();
  }

  public async execute(
    request: CreateDueRequestDto
  ): Promise<Result<null, Error>> {
    await this.validatePermission(ScopeEnum.Dues, PermissionEnum.Create);

    const session = MongoUtils.startSession();

    try {
      await session.withTransaction(async () => {
        await Promise.all(
          request.memberIds.map(async (memberId: string) => {
            const member = await this._memberPort.findOneByIdOrThrow(memberId);

            const dueMember = DueMember.create({
              _id: memberId,
              name: member.name,
            });

            if (dueMember.isErr()) {
              throw dueMember.error;
            }

            const due = Due.create({
              amount: request.amount,
              category: request.category,
              date: request.date,
              member: dueMember.value,
              notes: request.notes,
            });

            if (due.isErr()) {
              throw due.error;
            }

            await this._duePort.create(due.value);
          })
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
