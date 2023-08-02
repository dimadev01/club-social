import { err, ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { UseCase } from '@application/common/use-case.base';
import { IUseCase } from '@application/common/use-case.interfaces';
import { MemberNotFoundError } from '@domain/members/errors/member-not-found.error';
import { MembersCollection } from '@domain/members/members.collection';
import { RemoveMemberRequestDto } from '@domain/members/use-cases/remove-member/remove-member-request.dto';
import { LoggerOstrio } from '@infra/logger/logger-ostrio';

@injectable()
export class RemoveMemberUseCase
  extends UseCase<RemoveMemberRequestDto>
  implements IUseCase<RemoveMemberRequestDto, undefined>
{
  public constructor(private readonly _logger: LoggerOstrio) {
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
