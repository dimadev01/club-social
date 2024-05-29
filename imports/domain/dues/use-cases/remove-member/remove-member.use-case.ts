import { DeleteMemberRequestDto } from '@domain/members/use-cases/delete-member/delete-member-request.dto';
import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { ILogger } from '@application/logger/logger.interface';
import { IUseCaseOld } from '@application/use-cases/use-case.interface';
import { DIToken } from '@domain/common/tokens.di';
import { MemberNotFoundError } from '@domain/members/errors/member-not-found.error';
import { MemberCollectionOld } from '@infra/mongo/collections/member.collection.old';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class RemoveMemberUseCase
  extends UseCase<DeleteMemberRequestDto>
  implements IUseCaseOld<DeleteMemberRequestDto, null>
{
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
  ) {
    super();
  }

  public async execute(
    request: DeleteMemberRequestDto,
  ): Promise<Result<null, Error>> {
    await this.validateDto(DeleteMemberRequestDto, request);

    const member = await MemberCollectionOld.findOneAsync(request.id);

    if (!member) {
      return err(new MemberNotFoundError());
    }

    await MemberCollectionOld.removeAsync(request.id);

    this._logger.info('Member removed', { member });

    return ok(null);
  }
}
