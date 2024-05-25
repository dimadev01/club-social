import { err, ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { ILogger } from '@application/logger/logger.interface';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { IDuePort } from '@domain/dues/due.port';
import { DueMember } from '@domain/dues/entities/due-member';
import { UpdateDueRequestDto } from '@domain/dues/use-cases/update-due/update-due-request.dto';
import { IMemberPort } from '@domain/members/member.port';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';
import { DateUtils } from '@shared/utils/date.utils';

@injectable()
export class UpdateDueUseCase
  extends UseCase<UpdateDueRequestDto>
  implements IUseCase<UpdateDueRequestDto, null>
{
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
    @inject(DIToken.DueRepository)
    private readonly _duePort: IDuePort,
    @inject(DIToken.MemberRepository)
    private readonly _memberPort: IMemberPort,
  ) {
    super();
  }

  public async execute(
    request: UpdateDueRequestDto,
  ): Promise<Result<null, Error>> {
    await this.validatePermission(ScopeEnum.Movements, PermissionEnum.Update);

    const due = await this._duePort.findOneByIdOrThrow(request.id);

    const updates = [
      due.setAmount(request.amount),
      due.setNotes(request.notes),
      due.setCategory(request.category),
      due.setDate(DateUtils.utc(request.date).toDate()),
    ];

    if (due.member._id !== request.memberId) {
      const member = await this._memberPort.findOneByIdOrThrow(
        request.memberId,
      );

      const dueMember = DueMember.create({
        _id: member._id,
        name: member.name,
      });

      if (dueMember.isErr()) {
        return err(dueMember.error);
      }

      updates.push(due.setMember(dueMember.value));
    }

    const updateDueResult: Result<null[], Error> = Result.combine(updates);

    if (updateDueResult.isErr()) {
      return err(updateDueResult.error);
    }

    await this._duePort.update(due);

    this._logger.info('Due updated', { dueId: request.id });

    return ok(null);
  }
}
