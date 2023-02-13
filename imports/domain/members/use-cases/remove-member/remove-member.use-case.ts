import { err, ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { MembersCollection } from '@domain/members/members.collection';
import { RemoveMemberRequestDto } from '@domain/members/use-cases/remove-member/remove-member-request.dto';
import { Logger } from '@infra/logger/logger.service';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

@injectable()
export class RemoveMemberUseCase
  extends UseCase<RemoveMemberRequestDto>
  implements IUseCase<RemoveMemberRequestDto, undefined>
{
  public constructor(private readonly _logger: Logger) {
    super();
  }

  public async execute(
    request: RemoveMemberRequestDto
  ): Promise<Result<undefined, Error>> {
    await this.validateDto(RemoveMemberRequestDto, request);

    const member = await MembersCollection.findOneAsync(request.id);

    if (!member) {
      return err(new Error('Member not found'));
    }

    await MembersCollection.removeAsync(request.id);

    this._logger.info('Member removed', { member });

    return ok(undefined);
  }
}
