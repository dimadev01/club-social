import { err, ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { UseCase } from '@application/common/use-case.base';
import { IUseCase } from '@application/common/use-case.interfaces';
import { ILogger } from '@application/logger/logger.interface';
import { MemberNotFoundError } from '@domain/members/errors/member-not-found.error';
import { MembersCollection } from '@domain/members/members.collection';
import { RemoveMemberRequestDto } from '@domain/members/use-cases/remove-member/remove-member-request.dto';
import { Tokens } from '@infra/di/di-tokens';

@injectable()
export class RemoveMemberUseCase
  extends UseCase<RemoveMemberRequestDto>
  implements IUseCase<RemoveMemberRequestDto, undefined>
{
  public constructor(
    @inject(Tokens.Logger)
    private readonly _logger: ILogger
  ) {
    super();
  }

  public async execute(
    request: RemoveMemberRequestDto
  ): Promise<Result<undefined, Error>> {
    await this.validateDto(RemoveMemberRequestDto, request);

    const member = await MembersCollection.findOneAsync(request.id);

    if (!member) {
      return err(new MemberNotFoundError());
    }

    await MembersCollection.removeAsync(request.id);

    this._logger.info('Member removed', { member });

    return ok(undefined);
  }
}
