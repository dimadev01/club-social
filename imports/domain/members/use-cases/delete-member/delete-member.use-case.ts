import { ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { ILogger } from '@application/logger/logger.interface';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { IMemberPort } from '@domain/members/member.port';
import { DeleteMemberRequestDto } from '@domain/members/use-cases/delete-member/delete-member-request.dto';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class DeleteMemberUseCase
  extends UseCase<DeleteMemberRequestDto>
  implements IUseCase<DeleteMemberRequestDto, null>
{
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
    @inject(DIToken.MemberRepository)
    private readonly _memberPort: IMemberPort,
  ) {
    super();
  }

  public async execute(
    request: DeleteMemberRequestDto,
  ): Promise<Result<null, Error>> {
    const member = await this._memberPort.findOneByIdOrThrow(request.id);

    await this._memberPort.delete(member);

    this._logger.info('Member deleted', { member });

    return ok(null);
  }
}
